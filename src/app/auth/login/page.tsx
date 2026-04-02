"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-stone-500 text-sm mb-6">
          We sent a magic link to <strong className="text-foreground">{email}</strong>.
          Click the link in the email to sign in.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-red-600 hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center mb-2">Sign In</h1>
      <p className="text-center text-sm text-stone-500 mb-8">
        Enter your email and we&apos;ll send you a magic link.
      </p>

      <form onSubmit={handleMagicLink} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>
    </div>
  );
}
