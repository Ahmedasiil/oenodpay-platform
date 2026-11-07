import { NextResponse, type NextRequest } from "next/server";
import { API_URL, csrfOk, forbidden } from "@/lib/server/bff";

export async function POST(req: NextRequest) {
  if (!csrfOk(req)) return forbidden();
  const upstream = await fetch(`${API_URL}/v1/auth/passkey/options`, { method: "POST", cache: "no-store" });
  return NextResponse.json(await upstream.json(), { status: upstream.status, headers: { "cache-control": "no-store" } });
}
