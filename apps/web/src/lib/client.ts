"use client";

/** Browser-side calls go to our own server, which holds the session in HttpOnly cookies. */
export class ClientError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

export async function call<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(path, {
    method: init.method ?? "GET",
    headers: { "x-oenodpay-csrf": "1", ...(init.body !== undefined ? { "content-type": "application/json" } : {}) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ClientError(res.status, data.error ?? "request_failed");
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}
