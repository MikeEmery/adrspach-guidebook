"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileHeader({
  userId,
  displayName,
  email,
}: {
  userId: string;
  displayName: string;
  email: string;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ display_name: name.trim() })
      .eq("id", userId);
    setSaving(false);
    setEditing(false);
    router.refresh();
  };

  return (
    <div className="mb-8">
      {editing ? (
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="text-3xl font-bold bg-card border border-card-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setName(displayName);
                setEditing(false);
              }
            }}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-medium transition"
          >
            {saving ? "..." : "Save"}
          </button>
          <button
            onClick={() => {
              setName(displayName);
              setEditing(false);
            }}
            className="text-sm text-muted hover:text-foreground transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{displayName}</h1>
          <button
            onClick={() => setEditing(true)}
            className="text-muted hover:text-amber-600 transition"
            title="Edit display name"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      )}
      <p className="text-muted">{email}</p>
    </div>
  );
}
