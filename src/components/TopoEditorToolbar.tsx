"use client";

import type { TopoTool } from "@/lib/topo-types";
import { TOPO_COLORS } from "@/lib/topo-types";

type Props = {
  tool: TopoTool;
  onToolChange: (t: TopoTool) => void;
  color: string;
  onColorChange: (c: string) => void;
  selectedId: string | null;
  onDelete: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
  activePoints: [number, number][];
};

const tools: { id: TopoTool; label: string; icon: string }[] = [
  { id: "polyline", label: "Draw Line", icon: "M3 17L9 11L13 15L21 7" },
  { id: "label", label: "Add Label", icon: "M4 7V4h16v3M9 20h6M12 4v16" },
  { id: "select", label: "Select", icon: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" },
];

export default function TopoEditorToolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  selectedId,
  onDelete,
  onUndo,
  canUndo,
  onSave,
  saving,
  dirty,
  activePoints,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-card border border-card-border rounded-2xl p-3 mb-4">
      {/* Tools */}
      <div className="flex gap-1">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => onToolChange(t.id)}
            title={t.label}
            className={`p-2 rounded-lg transition ${
              tool === t.id
                ? "bg-amber-600 text-white"
                : "bg-transparent text-muted hover:bg-amber-100 dark:hover:bg-amber-900/30"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={t.icon} />
            </svg>
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-card-border" />

      {/* Colors */}
      <div className="flex gap-1">
        {TOPO_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onColorChange(c.value)}
            title={c.name}
            className={`w-6 h-6 rounded-full border-2 transition ${
              color === c.value
                ? "border-amber-600 scale-110"
                : "border-card-border hover:border-amber-400"
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>

      <div className="w-px h-6 bg-card-border" />

      {/* Actions */}
      <div className="flex gap-1 items-center">
        {selectedId && (
          <button
            onClick={onDelete}
            className="px-2 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Delete
          </button>
        )}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-2 rounded-lg text-muted hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-30 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10h10a5 5 0 0 1 0 10H9" />
            <path d="M3 10l4-4M3 10l4 4" />
          </svg>
        </button>
      </div>

      {/* Drawing hint */}
      {tool === "polyline" && activePoints.length > 0 && (
        <span className="text-xs text-muted ml-auto">
          {activePoints.length} points — double-click to finish
        </span>
      )}

      {/* Save */}
      <button
        onClick={onSave}
        disabled={saving}
        className={`ml-auto px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
          dirty
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-card border border-card-border text-muted"
        } disabled:opacity-50`}
      >
        {saving ? "Saving..." : dirty ? "Save" : "Saved"}
      </button>
    </div>
  );
}
