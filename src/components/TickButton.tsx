"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type TickData = { id: string; ticked_at: string; style: string | null };

export default function TickButton({
  routeId,
  userId,
  existingTicks,
}: {
  routeId: string;
  userId: string | null;
  existingTicks: TickData[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [style, setStyle] = useState("lead");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  if (!userId) {
    return (
      <div className="mb-8 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-center text-sm text-stone-500">
        <a href="/auth/login" className="text-red-600 font-medium hover:underline">
          Sign in
        </a>{" "}
        to log your ticks.
      </div>
    );
  }

  const handleTick = async () => {
    setSaving(true);
    await supabase.from("ticks").insert({
      route_id: routeId,
      user_id: userId,
      ticked_at: date,
      style,
      notes: notes || null,
    });
    setSaving(false);
    setShowForm(false);
    setNotes("");
    router.refresh();
  };

  const handleDelete = async (tickId: string) => {
    await supabase.from("ticks").delete().eq("id", tickId);
    router.refresh();
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Your Ticks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition"
        >
          + Log Tick
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-stone-500 block mb-1">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
              >
                <option value="lead">Lead</option>
                <option value="toprope">Top Rope</option>
                <option value="flash">Flash</option>
                <option value="onsight">Onsight</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-xs text-stone-500 block mb-1">
              Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go?"
              className="w-full px-2 py-1.5 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTick}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
            >
              {saving ? "Saving..." : "Save Tick"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-stone-500 hover:text-stone-700 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {existingTicks.length > 0 ? (
        <div className="space-y-2">
          {existingTicks.map((tick) => (
            <div
              key={tick.id}
              className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2 text-sm"
            >
              <div>
                <span className="font-medium capitalize">{tick.style || "lead"}</span>
                <span className="text-stone-400 ml-2">{tick.ticked_at}</span>
              </div>
              <button
                onClick={() => handleDelete(tick.id)}
                className="text-stone-400 hover:text-red-500 text-xs transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-400">
          No ticks yet. Log your first send!
        </p>
      )}
    </div>
  );
}
