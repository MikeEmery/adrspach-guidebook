"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTopoEditor } from "@/hooks/useTopoEditor";
import TopoEditorToolbar from "./TopoEditorToolbar";
import type { TopoDrawingData } from "@/lib/topo-types";

type Wall = { id: string; name: string; slug: string };
type WallImage = {
  id: string;
  wall_id: string;
  image_url: string;
  image_type: string;
};
type ExistingTopoMap = {
  id: string;
  wall_id: string;
  wall_image_id: string;
  drawing_data: TopoDrawingData;
  image_width: number;
  image_height: number;
};

export default function TopoEditor({
  walls,
  wallImages,
  existingTopoMaps,
}: {
  walls: Wall[];
  wallImages: WallImage[];
  existingTopoMaps: ExistingTopoMap[];
}) {
  const [selectedWallId, setSelectedWallId] = useState(walls[0]?.id || "");
  const [selectedImageId, setSelectedImageId] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const supabase = createClient();
  const editor = useTopoEditor();

  // Filter images for selected wall (topo photos only, not overviews)
  const wallImagesFiltered = wallImages.filter(
    (img) => img.wall_id === selectedWallId && img.image_type !== "overview"
  );

  // Auto-select first image when wall changes
  useEffect(() => {
    const first = wallImagesFiltered[0];
    if (first) {
      setSelectedImageId(first.id);
    } else {
      setSelectedImageId("");
    }
  }, [selectedWallId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load image and existing topo when selection changes
  useEffect(() => {
    if (!selectedImageId) return;

    const img = wallImages.find((i) => i.id === selectedImageId);
    if (!img) return;

    editor.loadImage(img.image_url);

    const existing = existingTopoMaps.find(
      (t) => t.wall_image_id === selectedImageId
    );
    if (existing) {
      editor.loadDrawingData(existing.drawing_data);
    } else {
      editor.loadDrawingData({ lines: [], labels: [] });
    }
  }, [selectedImageId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save handler
  const handleSave = useCallback(async () => {
    if (!selectedImageId || !selectedWallId) return;
    setSaving(true);
    setMessage("");

    const existing = existingTopoMaps.find(
      (t) => t.wall_image_id === selectedImageId
    );

    const payload = {
      wall_id: selectedWallId,
      wall_image_id: selectedImageId,
      drawing_data: editor.drawingData,
      image_width: editor.imageSize.width,
      image_height: editor.imageSize.height,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (existing) {
      ({ error } = await supabase
        .from("topo_maps")
        .update(payload)
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("topo_maps").insert(payload));
    }

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Saved!");
      editor.setDirty(false);
      router.refresh();
    }
    setSaving(false);
  }, [selectedImageId, selectedWallId, editor.drawingData, editor.imageSize, existingTopoMaps, supabase, router]); // eslint-disable-line react-hooks/exhaustive-deps

  // Label input position
  const labelInputPos = editor.pendingLabel
    ? editor.toPixel(editor.pendingLabel.x, editor.pendingLabel.y)
    : null;

  return (
    <div>
      {/* Wall / Image selectors */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-muted font-semibold uppercase tracking-wider mb-1">
            Wall
          </label>
          <select
            value={selectedWallId}
            onChange={(e) => setSelectedWallId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-card text-sm"
          >
            {walls.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted font-semibold uppercase tracking-wider mb-1">
            Image
          </label>
          <select
            value={selectedImageId}
            onChange={(e) => setSelectedImageId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-card text-sm"
          >
            {wallImagesFiltered.length === 0 && (
              <option value="">No images uploaded</option>
            )}
            {wallImagesFiltered.map((img, i) => {
              const hasTopo = existingTopoMaps.some(
                (t) => t.wall_image_id === img.id
              );
              return (
                <option key={img.id} value={img.id}>
                  {img.image_type} #{i + 1}
                  {hasTopo ? " (has topo)" : ""}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Toolbar */}
      <TopoEditorToolbar
        tool={editor.tool}
        onToolChange={(t) => {
          editor.cancelActive();
          editor.setTool(t);
        }}
        color={editor.color}
        onColorChange={editor.setColor}
        selectedId={editor.selectedId}
        onDelete={editor.deleteSelected}
        onUndo={editor.undo}
        canUndo={editor.undoStack.length > 0}
        onSave={handleSave}
        saving={saving}
        dirty={editor.dirty}
        activePoints={editor.activePoints}
      />

      {/* Canvas area */}
      {selectedImageId ? (
        <div
          ref={editor.containerRef}
          className="relative bg-black rounded-2xl overflow-hidden border border-card-border"
        >
          <canvas
            ref={editor.canvasRef}
            onClick={editor.handleClick}
            onDoubleClick={editor.handleDoubleClick}
            onMouseDown={editor.handleMouseDown}
            onMouseMove={editor.handleMouseMove}
            onMouseUp={editor.handleMouseUp}
            onMouseLeave={editor.handleMouseUp}
            className={`block w-full ${
              editor.dragging
                ? "cursor-grabbing"
                : editor.tool === "polyline"
                ? "cursor-crosshair"
                : editor.tool === "label"
                ? "cursor-text"
                : "cursor-pointer"
            }`}
            style={{
              height: editor.canvasSize.height || "auto",
            }}
          />

          {/* Label text input overlay */}
          {editor.pendingLabel && labelInputPos && (
            <div
              className="absolute"
              style={{
                left: labelInputPos[0],
                top: labelInputPos[1],
                transform: "translate(-50%, -50%)",
              }}
            >
              <input
                autoFocus
                type="text"
                placeholder="Label..."
                className="px-2 py-1 text-sm rounded-lg border-2 border-amber-500 bg-white text-black font-bold w-20 text-center shadow-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editor.confirmLabel((e.target as HTMLInputElement).value);
                  }
                  if (e.key === "Escape") {
                    editor.cancelActive();
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    editor.confirmLabel(e.target.value);
                  } else {
                    editor.cancelActive();
                  }
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border border-card-border rounded-2xl p-12 text-center text-muted">
          Upload images to a wall first, then come back to annotate them.
        </div>
      )}

      {/* Status message */}
      {message && (
        <p
          className={`text-sm mt-3 ${
            message.startsWith("Error") ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Help text */}
      <div className="mt-4 text-xs text-muted space-y-1">
        <p><strong>Draw Line:</strong> Click to place points, double-click to finish the line.</p>
        <p><strong>Add Label:</strong> Click where you want the label, type text, press Enter.</p>
        <p><strong>Select:</strong> Click a line or label to select it, then press Delete or click the Delete button.</p>
        <p><strong>Shortcuts:</strong> Ctrl+Z to undo, Escape to cancel, Delete to remove selected.</p>
      </div>
    </div>
  );
}
