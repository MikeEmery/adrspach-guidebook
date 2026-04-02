import { createClient } from "@/lib/supabase/server";
import RouteFilters from "@/components/RouteFilters";

export const metadata = { title: "All Routes - Little Adrspach" };

export default async function RoutesPage() {
  const supabase = await createClient();

  const { data: routes } = await supabase
    .from("routes")
    .select("*, walls(id, name, slug)")
    .order("sort_order");

  const { data: walls } = await supabase
    .from("walls")
    .select("id, name, slug")
    .order("sort_order");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Routes</h1>
      <RouteFilters routes={routes || []} walls={walls || []} />
    </div>
  );
}
