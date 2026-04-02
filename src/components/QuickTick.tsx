"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

type RouteOption = {
  id: string;
  name: string;
  number: string;
  grade_yds: string | null;
  wall_name: string;
};

export default function QuickTick() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selected, setSelected] = useState<RouteOption | null>(null);
  const [attempt, setAttempt] = useState("redpoint");
  const [method, setMethod] = useState("lead");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all routes once on open
  useEffect(() => {
    if (!open) return;
    supabase
      .from("routes")
      .select("id, name, number, grade_yds, walls(name)")
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          setRoutes(
            data.map((r) => ({
              id: r.id,
              name: r.name,
              number: r.number,
              grade_yds: r.grade_yds,
              wall_name: (r.walls as unknown as { name: string })?.name || "",
            }))
          );
        }
      });
  }, [open, supabase]);

  // Focus search input when opening
  useEffect(() => {
    if (open && !selected) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, selected]);

  const filtered = query.trim()
    ? routes.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.number.includes(query) ||
          r.grade_yds?.toLowerCase().includes(query.toLowerCase())
      )
    : routes;

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    await supabase.from("ticks").insert({
      route_id: selected.id,
      user_id: user.id,
      ticked_at: new Date().toISOString().split("T")[0],
      style: `${attempt} (${method})`,
      notes: notes || null,
    });

    if (rating > 0) {
      await supabase.from("comments").insert({
        route_id: selected.id,
        user_id: user.id,
        body: notes || "Quick tick",
        rating,
      });
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => {
      handleClose();
      router.refresh();
    }, 800);
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setSelected(null);
    setAttempt("redpoint");
    setMethod("lead");
    setRating(0);
    setNotes("");
    setSuccess(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:text-amber-300 transition"
        aria-label="Quick tick"
        title="Quick Tick"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-card border border-card-border rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-card-border">
              <h2 className="font-bold text-lg">Quick Tick</h2>
              <button
                onClick={handleClose}
                className="text-muted hover:text-foreground transition p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {success ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">&#10003;</div>
                <p className="font-semibold">Ticked!</p>
              </div>
            ) : !selected ? (
              /* Route search */
              <div className="flex flex-col overflow-hidden">
                <div className="p-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search routes by name, number, or grade..."
                    className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="overflow-y-auto flex-1 px-3 pb-3">
                  {filtered.length === 0 ? (
                    <p className="text-sm text-muted text-center py-4">
                      No routes found
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {filtered.map((route) => (
                        <button
                          key={route.id}
                          onClick={() => setSelected(route)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition flex items-center gap-3"
                        >
                          <span className="text-xs font-mono text-muted w-8">
                            #{route.number}
                          </span>
                          <span className="flex-1 text-sm font-medium truncate">
                            {route.name}
                          </span>
                          <span className="text-xs text-muted">
                            {route.grade_yds}
                          </span>
                          <span className="text-xs text-muted truncate max-w-[80px]">
                            {route.wall_name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Tick form */
              <div className="p-4 space-y-4 overflow-y-auto">
                <div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xs text-amber-600 hover:underline mb-2"
                  >
                    &larr; Pick a different route
                  </button>
                  <div className="bg-background rounded-lg px-3 py-2 border border-card-border">
                    <span className="text-xs font-mono text-muted">
                      #{selected.number}
                    </span>{" "}
                    <span className="font-semibold text-sm">
                      {selected.name}
                    </span>{" "}
                    <span className="text-xs text-muted">
                      {selected.grade_yds}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted block mb-1">Attempt</label>
                    <select
                      value={attempt}
                      onChange={(e) => setAttempt(e.target.value)}
                      className="w-full px-2 py-1.5 rounded border border-card-border bg-background text-sm"
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
                      className="w-full px-2 py-1.5 rounded border border-card-border bg-background text-sm"
                    >
                      <option value="lead">Lead</option>
                      <option value="toprope">Top Rope</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1">
                    Rating (optional)
                  </label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1">
                    Notes (optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did it go?"
                    className="w-full px-2 py-1.5 rounded border border-card-border bg-background text-sm"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition"
                >
                  {saving ? "Saving..." : "Log Tick"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
