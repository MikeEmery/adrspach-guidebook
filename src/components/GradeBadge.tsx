export default function GradeBadge({ grade }: { grade: string | null }) {
  if (!grade) return <span className="text-stone-400 text-sm">N/A</span>;

  return (
    <span className="inline-block bg-stone-800 text-white px-2 py-0.5 rounded text-sm font-mono font-medium">
      {grade}
    </span>
  );
}
