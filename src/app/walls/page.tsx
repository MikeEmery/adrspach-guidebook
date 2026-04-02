import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Walls - Little Adrspach" };

export default async function WallsPage() {
  const supabase = await createClient();
  const { data: walls } = await supabase
    .from("walls")
    .select("*")
    .order("sort_order");

  const { data: routes } = await supabase
    .from("routes")
    .select("wall_id");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">All Walls</h1>
      <p className="text-muted mb-8 leading-relaxed">
        The guidebook reads from right to left. Alphabet Wall is the first wall
        you reach from the road entrance.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {walls?.map((wall) => {
          const routeCount =
            routes?.filter((r) => r.wall_id === wall.id).length ?? 0;
          return (
            <Link
              key={wall.id}
              href={`/walls/${wall.slug}`}
              className="group block bg-card rounded-2xl shadow-sm border border-card-border p-5 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 hover:-translate-y-0.5 transition-all duration-200"
            >
              <h3 className="font-bold text-lg group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">
                {wall.name}
              </h3>
              <p className="text-sm text-muted mt-1">
                {routeCount} route{routeCount !== 1 ? "s" : ""}
              </p>
              {wall.description && (
                <p className="text-sm text-muted mt-2 line-clamp-2">
                  {wall.description}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
