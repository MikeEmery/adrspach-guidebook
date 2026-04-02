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
      <h1 className="text-3xl font-bold mb-6">All Walls</h1>
      <p className="text-stone-500 dark:text-stone-400 mb-8">
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
              className="block bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700 p-5 hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600 transition"
            >
              <h3 className="font-semibold text-lg">{wall.name}</h3>
              <p className="text-sm text-stone-500 mt-1">
                {routeCount} route{routeCount !== 1 ? "s" : ""}
              </p>
              {wall.description && (
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">
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
