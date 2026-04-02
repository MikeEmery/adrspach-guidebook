const colors: Record<string, string> = {
  sport: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  trad: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  mixed: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  TR: "bg-stone-50 text-stone-600 border-stone-200 dark:bg-stone-800/50 dark:text-stone-400 dark:border-stone-700",
};

export default function ProtectionBadge({
  protection,
}: {
  protection: string | null;
}) {
  if (!protection) return null;
  const colorClass = colors[protection] || colors["sport"];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-lg border text-xs font-semibold ${colorClass}`}
    >
      {protection}
    </span>
  );
}
