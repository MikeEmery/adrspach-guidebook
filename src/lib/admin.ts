export function isAdmin(identifier: string | undefined | null): boolean {
  if (!identifier) return false;
  const admins = (process.env.ADMIN_USERS || process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  return admins.includes(identifier.toLowerCase());
}
