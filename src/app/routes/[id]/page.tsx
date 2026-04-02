import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProtectionBadge from "@/components/ProtectionBadge";
import GradeBadge from "@/components/GradeBadge";
import TickButton from "@/components/TickButton";
import CommentSection from "@/components/CommentSection";

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
      <nav className="text-sm text-stone-500 mb-4">
        <Link href="/" className="hover:text-stone-700 dark:hover:text-stone-300">
          Home
        </Link>
        {" / "}
        <Link
          href={`/walls/${wall.slug}`}
          className="hover:text-stone-700 dark:hover:text-stone-300"
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
            <span className="text-stone-400 font-mono text-sm">
              #{route.number}
            </span>
            <ProtectionBadge protection={route.protection} />
          </div>
          <h1 className="text-3xl font-bold">{route.name}</h1>
        </div>
        <div className="text-right flex-shrink-0">
          <GradeBadge grade={route.grade_yds} />
          {route.grade_french && (
            <div className="text-xs text-stone-400 mt-1">
              ({route.grade_french})
            </div>
          )}
        </div>
      </div>

      {/* Route details */}
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <div className="text-stone-400 text-xs uppercase tracking-wide">
              Grade
            </div>
            <div className="font-medium">{route.grade_yds || "Unknown"}</div>
          </div>
          <div>
            <div className="text-stone-400 text-xs uppercase tracking-wide">
              Height
            </div>
            <div className="font-medium">
              {route.height_ft ? `${route.height_ft} ft` : "Unknown"}
            </div>
          </div>
          <div>
            <div className="text-stone-400 text-xs uppercase tracking-wide">
              Protection
            </div>
            <div className="font-medium capitalize">
              {route.protection || "Unknown"}
            </div>
          </div>
          <div>
            <div className="text-stone-400 text-xs uppercase tracking-wide">
              Rating
            </div>
            <div className="font-medium">
              {avgRating
                ? `${"★".repeat(Math.round(avgRating))}${"☆".repeat(5 - Math.round(avgRating))} (${ratings.length})`
                : "No ratings yet"}
            </div>
          </div>
        </div>

        {route.description && (
          <div>
            <div className="text-stone-400 text-xs uppercase tracking-wide mb-1">
              Description
            </div>
            <p className="text-sm leading-relaxed">{route.description}</p>
          </div>
        )}

        {route.first_ascent && (
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-700">
            <span className="text-stone-400 text-xs">First Ascent: </span>
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
