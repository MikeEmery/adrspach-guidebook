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
      <section className="text-center mb-14 pt-4">
        <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">
          2025 Edition
        </p>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
          Little Adrspach
        </h1>
        <p className="text-lg text-muted max-w-lg mx-auto leading-relaxed">
          A pocket crag with big character. 46 routes on beautiful sandstone
          walls, from mellow 5.7 slabs to pumpy 5.12 roofs. Paddle in by canoe,
          climb all day.
        </p>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-4 mb-14 max-w-sm mx-auto">
        {[
          { value: "46", label: "Routes" },
          { value: "8", label: "Walls" },
          { value: "5.7–12a", label: "Grades" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center bg-card border border-card-border rounded-2xl py-4 px-2"
          >
            <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">
              {stat.value}
            </div>
            <div className="text-xs text-muted uppercase tracking-wider mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* Wall cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Explore the Walls</h2>
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
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">
                      {wall.name}
                    </h3>
                    <p className="text-sm text-muted mt-1">
                      {routeCount} route{routeCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="text-muted group-hover:text-amber-600 dark:group-hover:text-amber-400 transition text-xl mt-0.5">
                    &rsaquo;
                  </span>
                </div>
                {wall.description && (
                  <p className="text-sm text-muted mt-2 line-clamp-2">
                    {wall.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse all routes link */}
      <section className="mt-10 text-center">
        <Link
          href="/routes"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200"
        >
          Browse All 46 Routes
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
