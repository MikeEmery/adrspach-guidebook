"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Wall = { id: string; name: string; slug: string };
type ExistingImage = {
  id: string;
  wall_id: string;
  image_url: string;
  image_type: string;
  sort_order: number;
  walls: { name: string } | null;
};

export default function AdminUploader({
  walls,
  existingImages,
}: {
  walls: Wall[];
  existingImages: ExistingImage[];
}) {
  const [selectedWall, setSelectedWall] = useState(walls[0]?.id || "");
  const [imageType, setImageType] = useState("topo");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedWall) return;

    setUploading(true);
    setMessage("");

    // Get current max sort_order for this wall
    const wallImages = existingImages.filter(
      (img) => img.wall_id === selectedWall
    );
    let sortOrder = wallImages.length > 0
      ? Math.max(...wallImages.map((img) => img.sort_order)) + 1
      : 0;

    let uploaded = 0;

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${selectedWall}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("wall-images")
        .upload(fileName, file);

      if (uploadError) {
        setMessage(`Error uploading ${file.name}: ${uploadError.message}`);
        continue;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("wall-images").getPublicUrl(fileName);

      // Insert into wall_images table
      const { error: dbError } = await supabase.from("wall_images").insert({
        wall_id: selectedWall,
        image_url: publicUrl,
        image_type: imageType,
        sort_order: sortOrder++,
      });

      if (dbError) {
        setMessage(`Error saving ${file.name}: ${dbError.message}`);
        continue;
      }

      uploaded++;
    }

    setMessage(`Uploaded ${uploaded} image${uploaded !== 1 ? "s" : ""}.`);
    setUploading(false);
    e.target.value = "";
    router.refresh();
  };

  const handleDelete = async (imageId: string, imageUrl: string) => {
    // Extract storage path from URL
    const pathMatch = imageUrl.match(/wall-images\/(.+)$/);
    if (pathMatch) {
      await supabase.storage.from("wall-images").remove([pathMatch[1]]);
    }
    await supabase.from("wall_images").delete().eq("id", imageId);
    router.refresh();
  };

  const handleSwap = async (wallId: string, fromIndex: number, toIndex: number) => {
    const wallImages = existingImages
      .filter((img) => img.wall_id === wallId)
      .sort((a, b) => a.sort_order - b.sort_order);

    if (toIndex < 0 || toIndex >= wallImages.length) return;

    const imgA = wallImages[fromIndex];
    const imgB = wallImages[toIndex];

    // Swap their sort_order values
    await Promise.all([
      supabase.from("wall_images").update({ sort_order: imgB.sort_order }).eq("id", imgA.id),
      supabase.from("wall_images").update({ sort_order: imgA.sort_order }).eq("id", imgB.id),
    ]);
    router.refresh();
  };

  // Group images by wall
  const imagesByWall = walls.map((wall) => ({
    ...wall,
    images: existingImages
      .filter((img) => img.wall_id === wall.id)
      .sort((a, b) => a.sort_order - b.sort_order),
  }));

  return (
    <div>
      {/* Upload form */}
      <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Upload Images</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Wall</label>
            <select
              value={selectedWall}
              onChange={(e) => setSelectedWall(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm"
            >
              {walls.map((wall) => (
                <option key={wall.id} value={wall.id}>
                  {wall.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm"
            >
              <option value="topo">Topo Photo</option>
              <option value="overview">Overview / Map</option>
            </select>
          </div>
        </div>

        <label
          className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
            uploading
              ? "border-stone-300 bg-stone-50 dark:bg-stone-900"
              : "border-stone-300 dark:border-stone-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <span className="text-stone-500 text-sm">Uploading...</span>
          ) : (
            <>
              <div className="text-3xl mb-2">+</div>
              <span className="text-stone-500 text-sm">
                Click to select images or drag and drop
              </span>
            </>
          )}
        </label>

        {message && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-3">
            {message}
          </p>
        )}
      </div>

      {/* Existing images by wall */}
      <h2 className="text-lg font-semibold mb-4">Existing Images</h2>
      {imagesByWall.map((wall) => (
        <div key={wall.id} className="mb-8">
          <h3 className="font-medium text-sm text-stone-500 uppercase tracking-wide mb-3">
            {wall.name} ({wall.images.length})
          </h3>
          {wall.images.length === 0 ? (
            <p className="text-sm text-stone-400 mb-4">No images yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {wall.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative group rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700"
                >
                  <img
                    src={img.image_url}
                    alt={`${wall.name} ${img.image_type}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition flex gap-2">
                      <button
                        onClick={() => handleSwap(wall.id, idx, idx - 1)}
                        disabled={idx === 0}
                        className="bg-white text-stone-800 rounded-full w-7 h-7 text-xs font-bold hover:bg-stone-200 disabled:opacity-30"
                        title="Move left"
                      >
                        &larr;
                      </button>
                      <button
                        onClick={() => handleDelete(img.id, img.image_url)}
                        className="bg-red-600 text-white rounded-full w-7 h-7 text-xs font-bold hover:bg-red-700"
                        title="Delete"
                      >
                        &times;
                      </button>
                      <button
                        onClick={() => handleSwap(wall.id, idx, idx + 1)}
                        disabled={idx === wall.images.length - 1}
                        className="bg-white text-stone-800 rounded-full w-7 h-7 text-xs font-bold hover:bg-stone-200 disabled:opacity-30"
                        title="Move right"
                      >
                        &rarr;
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1">
                    {img.image_type} &middot; #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
