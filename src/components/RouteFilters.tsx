"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import GradeBadge from "./GradeBadge";
import ProtectionBadge from "./ProtectionBadge";

type Route = {
  id: string;
  number: string;
  name: string;
  grade_yds: string | null;
  grade_french: string | null;
  height_ft: number | null;
  protection: string | null;
  description: string | null;
  walls: { id: string; name: string; slug: string } | null;
};

type Wall = { id: string; name: string; slug: string };

const GRADE_ORDER = [
  "5.7",
  "5.8",
  "5.9",
  "5.10a",
  "5.10b",
  "5.10c",
  "5.10d",
  "5.11a",
  "5.11b",
  "5.11c",
  "5.12a",
];

function normalizeGrade(g: string | null): string | null {
  if (!g) return null;
  const clean = g.replace("?", "").replace("+", "").trim();
  // Handle grades like "10b" -> "5.10b", "10c?" -> "5.10c"
  if (/^\d+/.test(clean) && !clean.startsWith("5.")) {
    return "5." + clean;
  }
  // Handle ranges like "5.10a-c" -> "5.10a"
  const dashIdx = clean.indexOf("-");
  if (dashIdx > 0 && clean[dashIdx + 1]?.match(/[a-d]/)) {
    return clean.substring(0, dashIdx);
  }
  // Handle "5.9/10a" -> "5.9"
  const slashIdx = clean.indexOf("/");
  if (slashIdx > 0) return clean.substring(0, slashIdx);
  return clean;
}

function gradeIndex(grade: string | null): number {
  const norm = normalizeGrade(grade);
  if (!norm) return -1;
  const idx = GRADE_ORDER.indexOf(norm);
  if (idx >= 0) return idx;
  // Try partial match (e.g. "5.10" matches "5.10a")
  const partial = GRADE_ORDER.findIndex((g) => g.startsWith(norm));
  return partial >= 0 ? partial : -1;
}

export default function RouteFilters({
  routes,
  walls,
}: {
  routes: Route[];
  walls: Wall[];
}) {
  const [search, setSearch] = useState("");
  const [wallFilter, setWallFilter] = useState("");
  const [protectionFilter, setProtectionFilter] = useState("");
  const [minGrade, setMinGrade] = useState("");
  const [maxGrade, setMaxGrade] = useState("");

  const filtered = useMemo(() => {
    return routes.filter((r) => {
      // Text search
      if (search) {
        const q = search.toLowerCase();
        const matches =
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.number.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Wall filter
      if (wallFilter && r.walls?.id !== wallFilter) return false;
      // Protection filter
      if (protectionFilter && r.protection !== protectionFilter) return false;
      // Grade filter
      const gi = gradeIndex(r.grade_yds);
      if (minGrade) {
        const minIdx = GRADE_ORDER.indexOf(minGrade);
        if (gi >= 0 && gi < minIdx) return false;
      }
      if (maxGrade) {
        const maxIdx = GRADE_ORDER.indexOf(maxGrade);
        if (gi >= 0 && gi > maxIdx) return false;
      }
      return true;
    });
  }, [routes, search, wallFilter, protectionFilter, minGrade, maxGrade]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search routes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <select
          value={wallFilter}
          onChange={(e) => setWallFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
        >
          <option value="">All Walls</option>
          {walls.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        <select
          value={protectionFilter}
          onChange={(e) => setProtectionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
        >
          <option value="">All Types</option>
          <option value="sport">Sport</option>
          <option value="trad">Trad</option>
          <option value="mixed">Mixed</option>
          <option value="TR">Top Rope</option>
        </select>
      </div>

      {/* Grade range */}
      <div className="flex gap-3 mb-6 items-center text-sm">
        <span className="text-stone-500">Grade:</span>
        <select
          value={minGrade}
          onChange={(e) => setMinGrade(e.target.value)}
          className="px-2 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
        >
          <option value="">Min</option>
          {GRADE_ORDER.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <span className="text-stone-400">to</span>
        <select
          value={maxGrade}
          onChange={(e) => setMaxGrade(e.target.value)}
          className="px-2 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
        >
          <option value="">Max</option>
          {GRADE_ORDER.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <span className="text-stone-400 ml-2">
          {filtered.length} route{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Results */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-700 text-left text-stone-500">
              <th className="py-2 pr-2 w-10">#</th>
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2 hidden sm:table-cell">Wall</th>
              <th className="py-2 pr-2 w-20">Grade</th>
              <th className="py-2 w-16">Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((route) => (
              <tr
                key={route.id}
                className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition"
              >
                <td className="py-3 pr-2 text-stone-400 font-mono text-xs">
                  {route.number}
                </td>
                <td className="py-3 pr-2">
                  <Link
                    href={`/routes/${route.id}`}
                    className="font-medium hover:text-red-600 transition"
                  >
                    {route.name}
                  </Link>
                  <span className="sm:hidden text-xs text-stone-400 ml-2">
                    {route.walls?.name}
                  </span>
                </td>
                <td className="py-3 pr-2 hidden sm:table-cell">
                  {route.walls && (
                    <Link
                      href={`/walls/${route.walls.slug}`}
                      className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 text-xs"
                    >
                      {route.walls.name}
                    </Link>
                  )}
                </td>
                <td className="py-3 pr-2">
                  <GradeBadge grade={route.grade_yds} />
                </td>
                <td className="py-3">
                  <ProtectionBadge protection={route.protection} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-stone-400 py-8">
            No routes match your filters.
          </p>
        )}
      </div>
    </>
  );
}
