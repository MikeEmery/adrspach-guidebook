import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
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
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Little Adrspach
        </h1>
        <p className="text-lg text-stone-500 dark:text-stone-400 mb-2">
          2025 Edition
        </p>
        <p className="text-stone-600 dark:text-stone-300 max-w-xl mx-auto">
          46 routes across 8 walls. Sport, trad, and mixed climbing on beautiful
          sandstone. From 5.7 to 5.12a.
        </p>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-4 mb-12 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold">46</div>
          <div className="text-xs text-stone-500 uppercase tracking-wide">
            Routes
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">8</div>
          <div className="text-xs text-stone-500 uppercase tracking-wide">
            Walls
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">5.7-12a</div>
          <div className="text-xs text-stone-500 uppercase tracking-wide">
            Grades
          </div>
        </div>
      </section>

      {/* Wall cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Walls</h2>
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
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {wall.name}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">
                      {routeCount} route{routeCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-stone-400 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                {wall.description && (
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">
                    {wall.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse all routes link */}
      <section className="mt-8 text-center">
        <Link
          href="/routes"
          className="inline-flex items-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-6 py-3 rounded-lg font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition"
        >
          Browse All Routes
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </section>
    </div>
  );
}
