function gradeColor(grade: string): string {
  const g = grade.replace("?", "").replace("+", "").trim();
  // Normalize
  const norm = g.startsWith("5.") ? g : `5.${g}`;

  if (norm <= "5.8") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (norm <= "5.9") return "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300";
  if (norm.startsWith("5.10")) return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
  if (norm.startsWith("5.11")) return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
  return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
}

export default function GradeBadge({ grade }: { grade: string | null }) {
  if (!grade) return <span className="text-muted text-sm">?</span>;

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold font-mono ${gradeColor(grade)}`}
    >
      {grade}
    </span>
  );
}
