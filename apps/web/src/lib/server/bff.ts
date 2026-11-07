import { NextResponse, type NextRequest } from "next/server";

/**
 * The website never gives tokens to browser JavaScript. This server-side layer ("backend for
 * frontend") keeps them in HttpOnly, Secure, SameSite=Strict cookies and adds them to calls to the
 * oenodPay API. Script injection on the page therefore can't read or steal a session.
 */
export const API_URL = process.env.OENODPAY_API_URL ?? "http://localhost:4000";

const secure = process.env.NODE_ENV === "production";
// The __Host- prefix makes browsers refuse the cookie unless it is Secure, host-only and path=/.
const ACCESS = secure ? "__Host-oenod_at" : "oenod_at";
const REFRESH = secure ? "__Host-oenod_rt" : "oenod_rt";

interface TokenPair { accessToken: string; refreshToken: string; expiresIn: number }

export function setSessionCookies(res: NextResponse, t: TokenPair) {
  const base = { httpOnly: true, secure, sameSite: "strict" as const, path: "/" };
  res.cookies.set(ACCESS, t.accessToken, { ...base, maxAge: t.expiresIn });
  res.cookies.set(REFRESH, t.refreshToken, { ...base, maxAge: 30 * 24 * 60 * 60 });
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.delete(ACCESS);
  res.cookies.delete(REFRESH);
}

/**
 * Blocks cross-site request forgery: state-changing calls must come from our own pages
 * (same Origin) and carry a custom header, which other sites can't add without CORS approval.
 */
export function csrfOk(req: NextRequest): boolean {
  if (req.method === "GET" || req.method === "HEAD") return true;
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) return false;
  return req.headers.get("x-oenodpay-csrf") === "1";
}

export const forbidden = () => NextResponse.json({ error: "forbidden" }, { status: 403 });

export function deviceName(req: NextRequest): string {
  const ua = req.headers.get("user-agent") ?? "";
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "Mac" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Linux/.test(ua) ? "Linux" : "";
  return os ? `${browser} on ${os}` : browser;
}

async function callApi(path: string, init: { method: string; body?: string; token?: string; idempotencyKey?: string | null }) {
  const headers: Record<string, string> = {};
  if (init.body !== undefined) headers["content-type"] = "application/json";
  if (init.token) headers.authorization = `Bearer ${init.token}`;
  if (init.idempotencyKey) headers["idempotency-key"] = init.idempotencyKey;
  return fetch(`${API_URL}${path}`, { method: init.method, headers, body: init.body, cache: "no-store" });
}

/** Forwards a sign-in style call. On success, stores the tokens in cookies and returns only the user. */
export async function signInVia(req: NextRequest, path: string): Promise<NextResponse> {
  if (!csrfOk(req)) return forbidden();
  const input = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const upstream = await callApi(path, {
    method: "POST", body: JSON.stringify({ ...input, deviceName: deviceName(req) })
  });
  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) return NextResponse.json(data, { status: upstream.status });
  const res = NextResponse.json({ user: data.user }, { status: upstream.status });
  setSessionCookies(res, data);
  return res;
}

/** Endpoints the browser may reach through the proxy. Anything else is refused. */
const ALLOWED = [
  /^me$/, /^wallet$/, /^sessions(\/[\w-]+)?$/, /^passkeys(\/[\w-]+)?$/, /^passkeys\/register\/(options|verify)$/,
  /^kyc\/(sessions|status|sandbox\/decide)$/, /^transfers\/wallet$/, /^quotes$/, /^corridors$/, /^auth\/logout$/,
];

export async function proxy(req: NextRequest, segments: string[]): Promise<NextResponse> {
  const path = segments.join("/");
  if (!ALLOWED.some((r) => r.test(path))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!csrfOk(req)) return forbidden();

  const body = req.method === "GET" || req.method === "DELETE" ? undefined : await req.text();
  const send = (token?: string) => callApi(`/v1/${path}`, {
    method: req.method, body: body || undefined, token, idempotencyKey: req.headers.get("idempotency-key")
  });

  let refreshed: TokenPair | undefined;
  let upstream = await send(req.cookies.get(ACCESS)?.value);
  if (upstream.status === 401 && req.cookies.get(REFRESH)) {
    const r = await callApi("/v1/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken: req.cookies.get(REFRESH)!.value }) });
    if (r.ok) {
      refreshed = await r.json();
      upstream = await send(refreshed!.accessToken);
    }
  }

  const res = upstream.status === 204
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json(await upstream.json().catch(() => ({})), { status: upstream.status });
  if (path === "auth/logout" || (upstream.status === 401 && !refreshed)) clearSessionCookies(res);
  else if (refreshed) setSessionCookies(res, refreshed);
  res.headers.set("cache-control", "no-store");
  return res;
}
