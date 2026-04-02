import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import AdminUploader from "@/components/AdminUploader";

export const metadata = { title: "Admin - Image Upload" };

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) redirect("/");

  const { data: walls } = await supabase
    .from("walls")
    .select("id, name, slug")
    .order("sort_order");

  // Get existing images grouped by wall
  const { data: images } = await supabase
    .from("wall_images")
    .select("*, walls(name)")
    .order("sort_order");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin: Image Upload</h1>
      <p className="text-stone-500 text-sm mb-8">
        Upload topo photos and overview images for each wall.
      </p>

      <AdminUploader walls={walls || []} existingImages={images || []} />
    </div>
  );
}
