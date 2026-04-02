"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleOAuth = async (provider: "google" | "facebook") => {
    setError("");
    setLoading(provider);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("email");

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
    setLoading(null);
  };

  if (sent) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">&#9993;&#65039;</div>
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-muted text-sm mb-6">
          We sent a magic link to <strong className="text-foreground">{email}</strong>.
          Click the link in the email to sign in.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-amber-600 hover:underline"
        >
          Use a different method
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center mb-2">Sign In</h1>
      <p className="text-center text-sm text-muted mb-8">
        Log your ticks, rate routes, and leave comments.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleOAuth("google")}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-stone-800 border border-card-border hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-50 text-foreground py-2.5 rounded-lg font-semibold transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loading === "google" ? "Redirecting..." : "Continue with Google"}
        </button>

        <button
          onClick={() => handleOAuth("facebook")}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          {loading === "facebook" ? "Redirecting..." : "Continue with Facebook"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-card-border" />
          <span className="text-xs text-muted">or</span>
          <div className="flex-1 h-px bg-card-border" />
        </div>

        {/* Magic link */}
        <form onSubmit={handleMagicLink} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="flex-1 px-3 py-2 rounded-lg border border-card-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={loading !== null}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
          >
            {loading === "email" ? "Sending..." : "Email me a link"}
          </button>
        </form>
      </div>
    </div>
  );
}
