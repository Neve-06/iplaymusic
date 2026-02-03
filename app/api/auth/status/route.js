import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Auth Status API Route Handler
 * 
 * GET /api/auth/status
 * 
 * Returns whether the user is authenticated based on presence of IPM_AT cookie.
 */
export async function GET() {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get("IPM_AT");

  return NextResponse.json({ authenticated: Boolean(accessTokenCookie) });
}
