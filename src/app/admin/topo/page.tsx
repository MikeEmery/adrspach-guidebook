import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import TopoEditor from "@/components/TopoEditor";

export const metadata = { title: "Topo Editor - Admin" };

export default async function TopoEditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) redirect("/");

  const { data: walls } = await supabase
    .from("walls")
    .select("id, name, slug")
    .order("sort_order");

  const { data: wallImages } = await supabase
    .from("wall_images")
    .select("id, wall_id, image_url, image_type")
    .order("sort_order");

  const { data: topoMaps } = await supabase
    .from("topo_maps")
    .select("id, wall_id, wall_image_id, drawing_data, image_width, image_height");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Topo Editor</h1>
      <p className="text-muted text-sm mb-8">
        Draw route lines and add labels on top of wall photos.
      </p>

      <TopoEditor
        walls={walls || []}
        wallImages={wallImages || []}
        existingTopoMaps={(topoMaps || []) as never[]}
      />
    </div>
  );
}
