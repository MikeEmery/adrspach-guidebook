"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#2c1810] text-[#f5ebe0] shadow-lg">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-extrabold text-lg tracking-tight flex items-center gap-2">
          <span className="text-amber-400">&#9650;</span>
          Little Adrspach
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/walls" className="hover:text-amber-300 transition">
            Walls
          </Link>
          <Link href="/routes" className="hover:text-amber-300 transition">
            All Routes
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="hover:text-amber-300 transition"
              >
                My Ticks
              </Link>
              <Link
                href="/admin"
                className="hover:text-amber-300 transition"
              >
                Admin
              </Link>
              <button
                onClick={handleSignOut}
                className="hover:text-amber-300 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#3d3128] px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link
            href="/walls"
            onClick={() => setMenuOpen(false)}
            className="hover:text-amber-300"
          >
            Walls
          </Link>
          <Link
            href="/routes"
            onClick={() => setMenuOpen(false)}
            className="hover:text-amber-300"
          >
            All Routes
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="hover:text-amber-300"
              >
                My Ticks
              </Link>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="hover:text-amber-300"
              >
                Admin
              </Link>
              <button
                onClick={handleSignOut}
                className="text-left hover:text-amber-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="hover:text-amber-300"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
