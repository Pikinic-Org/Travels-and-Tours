// Shared fetch helpers for talking to pikinic-site's API. Server-side only —
// they read FLIGHTS_PROXY_SECRET, which must never reach the browser.

const BASE_URL = process.env.PIKINIC_API_URL ?? "http://localhost:3000";

const requireProxySecret = (): string => {
  const proxySecret = process.env.FLIGHTS_PROXY_SECRET;
  if (!proxySecret) throw new Error("Missing environment variable: FLIGHTS_PROXY_SECRET");
  return proxySecret;
};

// Public content (blog, packages, offers) — safe to cache briefly.
export const getJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Request to ${path} failed with status ${res.status}`);
  return res.json();
};

// Flights, bookings and payments are never cached — prices and availability
// are only ever valid for a few minutes.
export const postJson = async <T>(path: string, body: unknown): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "x-flights-proxy-secret": requireProxySecret(),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request to ${path} failed with status ${res.status}`);
  return data;
};

export const getAuthenticatedJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    headers: { "x-flights-proxy-secret": requireProxySecret() },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request to ${path} failed with status ${res.status}`);
  return data;
};
