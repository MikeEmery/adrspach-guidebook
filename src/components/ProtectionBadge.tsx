const colors: Record<string, string> = {
  sport: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  trad: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  mixed: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  TR: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
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
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {protection}
    </span>
  );
}
