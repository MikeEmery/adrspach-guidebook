import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProtectionBadge from "@/components/ProtectionBadge";
import GradeBadge from "@/components/GradeBadge";
import TickButton from "@/components/TickButton";
import CommentSection from "@/components/CommentSection";
import { ydsToFrench } from "@/lib/grade-convert";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: route } = await supabase
    .from("routes")
    .select("name, grade_yds")
    .eq("id", id)
    .single();
  return {
    title: route
      ? `${route.name} (${route.grade_yds || "?"}) - Little Adrspach`
      : "Route Not Found",
  };
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: route } = await supabase
    .from("routes")
    .select("*, walls(*)")
    .eq("id", id)
    .single();

  if (!route) notFound();

  const wall = route.walls as unknown as {
    id: string;
    name: string;
    slug: string;
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's ticks for this route
  let userTicks: { id: string; ticked_at: string; style: string | null }[] = [];
  if (user) {
    const { data } = await supabase
      .from("ticks")
      .select("id, ticked_at, style")
      .eq("route_id", id)
      .eq("user_id", user.id)
      .order("ticked_at", { ascending: false });
    userTicks = data || [];
  }

  // Get comments
  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles(display_name)")
    .eq("route_id", id)
    .order("created_at", { ascending: false });

  // Avg rating
  const ratings = (comments || [])
    .map((c) => c.rating)
    .filter((r): r is number => r !== null);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-4 font-medium">
        <Link href="/" className="hover:text-amber-700 dark:hover:text-amber-400 transition">
          Home
        </Link>
        {" / "}
        <Link
          href={`/walls/${wall.slug}`}
          className="hover:text-amber-700 dark:hover:text-amber-400 transition"
        >
          {wall.name}
        </Link>
        {" / "}
        <span className="text-foreground">{route.name}</span>
      </nav>

      {/* Route header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-muted font-mono text-sm">
              #{route.number}
            </span>
            <ProtectionBadge protection={route.protection} />
          </div>
          <h1 className="text-3xl font-extrabold">{route.name}</h1>
        </div>
        <div className="text-right flex-shrink-0">
          <GradeBadge grade={route.grade_yds} />
          {ydsToFrench(route.grade_yds) && (
            <div className="text-xs text-muted mt-1">
              ({ydsToFrench(route.grade_yds)})
            </div>
          )}
        </div>
      </div>

      {/* Route details */}
      <div className="bg-card rounded-2xl border border-card-border p-5 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <div className="text-muted text-xs uppercase tracking-wider font-semibold">
              Grade
            </div>
            <div className="font-bold mt-0.5">{route.grade_yds || "Unknown"}</div>
          </div>
          <div>
            <div className="text-muted text-xs uppercase tracking-wider font-semibold">
              Height
            </div>
            <div className="font-bold mt-0.5">
              {route.height_ft ? `${route.height_ft} ft` : "Unknown"}
            </div>
          </div>
          <div>
            <div className="text-muted text-xs uppercase tracking-wider font-semibold">
              Protection
            </div>
            <div className="font-bold capitalize mt-0.5">
              {route.protection || "Unknown"}
            </div>
          </div>
          <div>
            <div className="text-muted text-xs uppercase tracking-wider font-semibold">
              Rating
            </div>
            <div className="font-bold mt-0.5 text-amber-600 dark:text-amber-400">
              {avgRating
                ? `${"★".repeat(Math.round(avgRating))}${"☆".repeat(5 - Math.round(avgRating))} (${ratings.length})`
                : "No ratings yet"}
            </div>
          </div>
        </div>

        {route.description && (
          <div>
            <div className="text-muted text-xs uppercase tracking-wider font-semibold mb-1">
              Description
            </div>
            <p className="text-sm leading-relaxed">{route.description}</p>
          </div>
        )}

        {route.first_ascent && (
          <div className="mt-3 pt-3 border-t border-card-border">
            <span className="text-muted text-xs font-semibold">First Ascent: </span>
            <span className="text-sm">{route.first_ascent}</span>
          </div>
        )}
      </div>

      {/* Tick button */}
      <TickButton
        routeId={route.id}
        userId={user?.id || null}
        existingTicks={userTicks}
      />

      {/* Comments */}
      <CommentSection
        routeId={route.id}
        userId={user?.id || null}
        initialComments={comments || []}
      />
    </div>
  );
}
