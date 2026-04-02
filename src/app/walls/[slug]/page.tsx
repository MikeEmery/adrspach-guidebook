import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProtectionBadge from "@/components/ProtectionBadge";
import GradeBadge from "@/components/GradeBadge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: wall } = await supabase
    .from("walls")
    .select("name")
    .eq("slug", slug)
    .single();
  return { title: wall ? `${wall.name} - Little Adrspach` : "Wall Not Found" };
}

export default async function WallPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: wall } = await supabase
    .from("walls")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!wall) notFound();

  const { data: routes } = await supabase
    .from("routes")
    .select("*")
    .eq("wall_id", wall.id)
    .order("sort_order");

  const { data: images } = await supabase
    .from("wall_images")
    .select("*")
    .eq("wall_id", wall.id)
    .order("sort_order");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-stone-500 mb-4">
        <Link href="/" className="hover:text-stone-700 dark:hover:text-stone-300">
          Home
        </Link>
        {" / "}
        <Link href="/walls" className="hover:text-stone-700 dark:hover:text-stone-300">
          Walls
        </Link>
        {" / "}
        <span className="text-foreground">{wall.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{wall.name}</h1>
      {wall.description && (
        <p className="text-stone-500 dark:text-stone-400 mb-6">
          {wall.description}
        </p>
      )}

      {/* Topo images */}
      {images && images.length > 0 && (
        <div className="mb-8 flex flex-col gap-4">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              alt={`${wall.name} topo`}
              className="rounded-lg w-full"
            />
          ))}
        </div>
      )}

      {/* Route table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-700 text-left text-stone-500">
              <th className="py-2 pr-2 w-10">#</th>
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2 w-20">Grade</th>
              <th className="py-2 pr-2 w-16 hidden sm:table-cell">Height</th>
              <th className="py-2 w-16">Type</th>
            </tr>
          </thead>
          <tbody>
            {routes?.map((route) => (
              <tr
                key={route.id}
                className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition"
              >
                <td className="py-3 pr-2 text-stone-400 font-mono text-xs">
                  {route.number}
                </td>
                <td className="py-3 pr-2">
                  <Link
                    href={`/routes/${route.id}`}
                    className="font-medium hover:text-red-600 transition"
                  >
                    {route.name}
                  </Link>
                  {route.description && (
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1 sm:line-clamp-2">
                      {route.description}
                    </p>
                  )}
                </td>
                <td className="py-3 pr-2">
                  <GradeBadge grade={route.grade_yds} />
                </td>
                <td className="py-3 pr-2 text-stone-500 hidden sm:table-cell">
                  {route.height_ft ? `${route.height_ft}'` : "—"}
                </td>
                <td className="py-3">
                  <ProtectionBadge protection={route.protection} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
