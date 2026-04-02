"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProjectButton({
  routeId,
  userId,
  isProject,
}: {
  routeId: string;
  userId: string | null;
  isProject: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState(isProject);
  const router = useRouter();
  const supabase = createClient();

  if (!userId) return null;

  const toggle = async () => {
    setSaving(true);
    if (active) {
      await supabase
        .from("projects")
        .delete()
        .eq("user_id", userId)
        .eq("route_id", routeId);
    } else {
      await supabase
        .from("projects")
        .insert({ user_id: userId, route_id: routeId });
    }
    setActive(!active);
    setSaving(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition disabled:opacity-50 ${
        active
          ? "bg-amber-600 text-white border border-amber-600 hover:bg-amber-700"
          : "bg-card border border-card-border text-muted hover:text-foreground hover:border-amber-400"
      }`}
      title={active ? "Remove from projects" : "Add to project list"}
    >
      <svg
        className="w-4 h-4"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {active ? "On Project List" : "Add to Projects"}
    </button>
  );
}
