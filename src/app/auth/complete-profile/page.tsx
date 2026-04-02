"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function CompleteProfileForm() {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ display_name: name.trim() })
        .eq("id", user.id);
    }

    router.push(next);
    router.refresh();
  };

  const handleSkip = () => {
    router.push(next);
    router.refresh();
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center mb-2">
        What should we call you?
      </h1>
      <p className="text-center text-sm text-muted mb-8">
        This name will appear on your ticks and comments.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            placeholder="e.g. Mike E."
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition"
        >
          {saving ? "Saving..." : "Continue"}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full text-sm text-muted hover:text-foreground transition"
        >
          Skip for now
        </button>
      </form>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense>
      <CompleteProfileForm />
    </Suspense>
  );
}
