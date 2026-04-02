/** YDS to French grade conversion map */
const YDS_TO_FRENCH: Record<string, string> = {
  "5.5": "4a",
  "5.6": "4b",
  "5.7": "4c",
  "5.8": "5a",
  "5.9": "5b",
  "5.10a": "6a",
  "5.10b": "6a+",
  "5.10c": "6b",
  "5.10d": "6b+",
  "5.11a": "6c",
  "5.11b": "6c+",
  "5.11c": "7a",
  "5.11d": "7a+",
  "5.12a": "7b",
  "5.12b": "7b+",
  "5.12c": "7c",
  "5.12d": "7c+",
  "5.13a": "8a",
  "5.13b": "8a+",
  "5.13c": "8b",
  "5.13d": "8b+",
  "5.14a": "8c",
};

export function ydsToFrench(yds: string | null | undefined): string | null {
  if (!yds) return null;
  return YDS_TO_FRENCH[yds] ?? null;
}
