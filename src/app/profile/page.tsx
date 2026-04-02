import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import GradeBadge from "@/components/GradeBadge";
import ProfileHeader from "@/components/ProfileHeader";

export const metadata = { title: "Profile - Little Adrspach" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: ticks } = await supabase
    .from("ticks")
    .select("*, routes(id, number, name, grade_yds, walls(name, slug))")
    .eq("user_id", user.id)
    .order("ticked_at", { ascending: false });

  const { data: projects } = await supabase
    .from("projects")
    .select("*, routes(id, number, name, grade_yds, walls(name, slug))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Stats
  const totalTicks = ticks?.length || 0;
  const uniqueRoutes = new Set(ticks?.map((t) => t.route_id)).size;
  const grades = ticks
    ?.map((t) => {
      const route = t.routes as unknown as { grade_yds: string | null };
      return route?.grade_yds;
    })
    .filter(Boolean) as string[];

  // Simple "hardest grade" - just pick the longest grade string as a rough proxy
  const hardest =
    grades.length > 0
      ? grades.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0]
      : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ProfileHeader
        userId={user.id}
        displayName={profile?.display_name || "Climber"}
        email={user.email || user.phone || ""}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
        <div className="bg-card border border-card-border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold">{totalTicks}</div>
          <div className="text-xs text-muted uppercase">Total Ticks</div>
        </div>
        <div className="bg-card border border-card-border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold">{uniqueRoutes}</div>
          <div className="text-xs text-muted uppercase">Unique Routes</div>
        </div>
        <div className="bg-card border border-card-border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold">{hardest || "—"}</div>
          <div className="text-xs text-muted uppercase">Hardest</div>
        </div>
      </div>

      {/* Project list */}
      {projects && projects.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="space-y-2 mb-8">
            {projects.map((proj) => {
              const route = proj.routes as unknown as {
                id: string;
                number: string;
                name: string;
                grade_yds: string | null;
                walls: { name: string; slug: string };
              };
              return (
                <div
                  key={proj.id}
                  className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <GradeBadge grade={route?.grade_yds} />
                    <div>
                      <Link
                        href={`/routes/${route?.id}`}
                        className="font-medium text-sm hover:text-amber-600 transition"
                      >
                        {route?.name}
                      </Link>
                      <div className="text-xs text-muted">
                        {route?.walls?.name}
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-amber-500"
                    fill="currentColor"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Tick list */}
      <h2 className="text-xl font-semibold mb-4">Tick List</h2>
      {ticks && ticks.length > 0 ? (
        <div className="space-y-2">
          {ticks.map((tick) => {
            const route = tick.routes as unknown as {
              id: string;
              number: string;
              name: string;
              grade_yds: string | null;
              walls: { name: string; slug: string };
            };
            return (
              <div
                key={tick.id}
                className="flex items-center justify-between bg-card border border-card-border rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <GradeBadge grade={route?.grade_yds} />
                  <div>
                    <Link
                      href={`/routes/${route?.id}`}
                      className="font-medium text-sm hover:text-amber-600 transition"
                    >
                      {route?.name}
                    </Link>
                    <div className="text-xs text-muted">
                      {route?.walls?.name}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-muted">
                  <div className="capitalize font-medium">
                    {tick.style || "lead"}
                  </div>
                  <div>{tick.ticked_at}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted text-sm">
          No ticks yet. Start climbing and log your sends!
        </p>
      )}
    </div>
  );
}
