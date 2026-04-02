"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Normalize: strip non-digits, add +1 if no country code
    let normalized = phone.replace(/[\s\-()]/g, "");
    if (!normalized.startsWith("+")) {
      normalized = "+1" + normalized.replace(/^\d/, (m) => m);
    }

    const { error } = await supabase.auth.signInWithOtp({ phone: normalized });

    if (error) {
      setError(error.message);
    } else {
      setPhone(normalized);
      setCodeSent(true);
    }
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Check if profile needs a display name
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();

        if (
          !profile ||
          !profile.display_name ||
          profile.display_name === user.phone
        ) {
          router.push("/auth/complete-profile?next=/");
          router.refresh();
          return;
        }
      }
      router.push("/");
      router.refresh();
    }
  };

  if (codeSent) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center mb-2">Enter Code</h1>
        <p className="text-center text-sm text-muted mb-8">
          We sent a 6-digit code to{" "}
          <strong className="text-foreground">{phone}</strong>
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={token}
            onChange={(e) =>
              setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="123456"
            className="w-full px-4 py-3 rounded-lg border border-card-border bg-card text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || token.length < 6}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <button
          onClick={() => {
            setCodeSent(false);
            setToken("");
            setError("");
          }}
          className="block mx-auto mt-4 text-sm text-amber-600 hover:underline"
        >
          Use a different number
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

      <form onSubmit={handleSendCode} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2.5 rounded-lg border border-card-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            autoFocus
          />
          <p className="text-xs text-muted mt-1">
            We&apos;ll send you a verification code via SMS.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading || !phone.trim()}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition"
        >
          {loading ? "Sending..." : "Send Code"}
        </button>
      </form>
    </div>
  );
}
