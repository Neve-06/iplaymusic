import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { searchAlbums } from "@/app/lib/spotify";

/**
 * Search API Route Handler
 * 
 * GET /api/search?q={query}
 * 
 * Proxies search requests to Spotify API, searching for albums, artists, and tracks.
 * Requires authentication via IPM_AT cookie.
 * 
 * @param {Request} request - Next.js request object
 * @returns {Response} JSON response with search results or error
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  // Validate query param
  if (!q) {
    return NextResponse.json({ error: "Query parameter required" }, { status: 400 });
  }

  // Read the Spotify access token from cookies
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get("IPM_AT");

  if (!accessTokenCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Use the shared Spotify helper to perform the search
    const data = await searchAlbums(accessTokenCookie.value, q, 10);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
