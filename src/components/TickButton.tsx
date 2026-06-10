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
  const [attempt, setAttempt] = useState("redpoint");
  const [method, setMethod] = useState("lead");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [quickSaving, setQuickSaving] = useState(false);
  const [quickError, setQuickError] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const today = new Date().toISOString().split("T")[0];
  const tickedToday = existingTicks.some((t) => t.ticked_at === today);

  if (!userId) {
    return (
      <div className="mb-8 p-4 bg-card rounded-lg text-center text-sm text-muted">
        <a href="/auth/login" className="text-amber-600 font-medium hover:underline">
          Sign in
        </a>{" "}
        to log your ticks.
      </div>
    );
  }

  const handleQuickSend = async () => {
    setQuickSaving(true);
    setQuickError(false);
    const { error } = await supabase.from("ticks").insert({
      route_id: routeId,
      user_id: userId,
      ticked_at: today,
      style: "redpoint (lead)",
    });
    setQuickSaving(false);
    if (error) setQuickError(true);
    else router.refresh();
  };

  const handleTick = async () => {
    setSaving(true);
    await supabase.from("ticks").insert({
      route_id: routeId,
      user_id: userId,
      ticked_at: date,
      style: `${attempt} (${method})`,
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
      {/* One-tap send: the common case (redpoint, lead, today) in a single press */}
      {tickedToday ? (
        <div className="w-full mb-4 flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 py-3 rounded-xl font-semibold">
          <span aria-hidden>✓</span> Sent today
        </div>
      ) : (
        <button
          onClick={handleQuickSend}
          disabled={quickSaving}
          className="w-full mb-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-base shadow-sm transition"
        >
          {quickSaving ? "Logging…" : "✓ Sent it today"}
        </button>
      )}
      {quickError && (
        <p className="text-sm text-red-500 mb-4 text-center">
          Couldn&apos;t save — try again.
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Your Ticks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-muted hover:text-foreground font-medium transition"
        >
          {showForm ? "Cancel" : "Log with details"}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-card-border rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs text-muted block mb-1">Attempt</label>
              <select
                value={attempt}
                onChange={(e) => setAttempt(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-card-border bg-card text-sm"
              >
                <option value="redpoint">Redpoint</option>
                <option value="flash">Flash</option>
                <option value="onsight">Onsight</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-card-border bg-card text-sm"
              >
                <option value="lead">Lead</option>
                <option value="toprope">Top Rope</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-card-border bg-card text-sm"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-xs text-muted block mb-1">
              Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go?"
              className="w-full px-2 py-1.5 rounded border border-card-border bg-card text-sm"
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
              className="text-muted hover:text-foreground text-sm"
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
                <span className="text-muted ml-2">{tick.ticked_at}</span>
              </div>
              <button
                onClick={() => handleDelete(tick.id)}
                className="text-muted hover:text-red-500 text-xs transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          No ticks yet. Log your first send!
        </p>
      )}
    </div>
  );
}
