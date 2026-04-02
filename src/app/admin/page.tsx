import { redirect } from "next/navigation";
import Link from "next/link";
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
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold">Admin: Image Upload</h1>
        <Link
          href="/admin/topo"
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Topo Editor
        </Link>
      </div>
      <p className="text-muted text-sm mb-8">
        Upload topo photos and overview images for each wall.
      </p>

      <AdminUploader walls={walls || []} existingImages={images || []} />
    </div>
  );
}
