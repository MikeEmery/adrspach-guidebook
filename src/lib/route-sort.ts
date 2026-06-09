// Sorting helpers for route "numbers".
//
// Route numbers are guidebook numbers that may carry a letter-suffixed
// variation, e.g. "13", "13.a", "13.b". A plain string sort would order
// "10" before "2", so we compare the numeric prefix numerically and fall
// back to a code-point comparison of the remainder ("" < ".a" < ".b").

function parseRouteNumber(value: string | null | undefined): {
  num: number;
  rest: string;
} {
  const str = (value ?? "").trim();
  const match = str.match(/^(\d+)(.*)$/);
  if (match) {
    return { num: parseInt(match[1], 10), rest: match[2].toLowerCase() };
  }
  // Non-numeric route numbers sort after numeric ones, then alphabetically.
  return { num: Number.POSITIVE_INFINITY, rest: str.toLowerCase() };
}

/** Compare two route numbers in ascending guidebook order. */
export function compareRouteNumbers(
  a: string | null | undefined,
  b: string | null | undefined,
): number {
  const pa = parseRouteNumber(a);
  const pb = parseRouteNumber(b);
  if (pa.num !== pb.num) return pa.num - pb.num;
  if (pa.rest < pb.rest) return -1;
  if (pa.rest > pb.rest) return 1;
  return 0;
}

/** Return a new array of routes sorted by route number, ascending. */
export function sortByRouteNumber<T extends { number: string | null }>(
  routes: readonly T[],
): T[] {
  return [...routes].sort((a, b) => compareRouteNumbers(a.number, b.number));
}
