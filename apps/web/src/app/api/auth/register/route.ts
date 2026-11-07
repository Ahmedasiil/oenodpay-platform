import type { NextRequest } from "next/server";
import { signInVia } from "@/lib/server/bff";

export async function POST(req: NextRequest) {
  return signInVia(req, "/v1/auth/register");
}
