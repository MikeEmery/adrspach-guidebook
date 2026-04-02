import { NextResponse } from "next/server";

// OAuth callback is no longer used — phone auth verifies client-side.
// Keeping route to avoid 404s from old bookmarks.
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/auth/login`);
}
