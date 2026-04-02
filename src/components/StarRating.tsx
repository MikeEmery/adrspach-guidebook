"use client";

export default function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-lg ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition ${
            star <= value ? "text-yellow-500" : "text-stone-300 dark:text-stone-600"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
