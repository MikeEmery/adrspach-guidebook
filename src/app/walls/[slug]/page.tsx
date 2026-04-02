import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProtectionBadge from "@/components/ProtectionBadge";
import GradeBadge from "@/components/GradeBadge";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";

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

  const { data: topoMaps } = await supabase
    .from("topo_maps")
    .select("wall_image_id, drawing_data")
    .eq("wall_id", wall.id);

  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Walls", href: "/walls" },
          { label: wall.name },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">{wall.name}</h1>
      {wall.description && (
        <p className="text-muted mb-6 leading-relaxed">
          {wall.description}
        </p>
      )}

      {/* Topo image gallery */}
      {images && images.length > 0 && (
        <ImageGallery
          images={[...images]
            .sort((a, b) => {
              if (a.image_type === b.image_type) return a.sort_order - b.sort_order;
              return a.image_type === "overview" ? -1 : 1;
            })
            .map((img) => {
              const topo = topoMaps?.find((t) => t.wall_image_id === img.id);
              return {
                id: img.id,
                url: img.image_url,
                type: img.image_type,
                drawingData: topo?.drawing_data ?? undefined,
              };
            })}
          wallName={wall.name}
        />
      )}

      {/* Route table */}
      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border text-left text-muted text-xs uppercase tracking-wider">
              <th className="py-3 pl-4 pr-2 w-10">#</th>
              <th className="py-3 pr-2">Name</th>
              <th className="py-3 pr-2 w-20">Grade</th>
              <th className="py-3 pr-2 w-16 hidden sm:table-cell">Height</th>
              <th className="py-3 pr-4 w-16">Type</th>
            </tr>
          </thead>
          <tbody>
            {routes?.map((route, i) => (
              <tr
                key={route.id}
                className={`border-b border-card-border last:border-b-0 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition ${
                  i % 2 === 0 ? "" : "bg-black/[0.02] dark:bg-white/[0.02]"
                }`}
              >
                <td className="py-3 pl-4 pr-2 text-muted font-mono text-xs">
                  {route.number}
                </td>
                <td className="py-3 pr-2">
                  <Link
                    href={`/routes/${route.id}`}
                    className="font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition"
                  >
                    {route.name} &rsaquo;
                  </Link>
                  {route.description && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-1 sm:line-clamp-2">
                      {route.description}
                    </p>
                  )}
                </td>
                <td className="py-3 pr-2">
                  <GradeBadge grade={route.grade_yds} />
                </td>
                <td className="py-3 pr-2 text-muted hidden sm:table-cell">
                  {route.height_ft ? `${route.height_ft}'` : "—"}
                </td>
                <td className="py-3 pr-4">
                  <ProtectionBadge protection={route.protection} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
