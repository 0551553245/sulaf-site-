// Talks to the Sulav Supabase database through its REST API.
// The URL and anon key are public by design; everything sensitive is guarded
// inside the database (row-level security, and ORDER_SECRET for server-only steps).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xuyhfwtqvolykgyyueve.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eWhmd3Rxdm9seWtneXl1ZXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0MDYxMjUsImV4cCI6MjExMDk4MjEyNX0.p19HRgEpm_08Yvx2V09qYYwkvv7NajGSEg5SbR1Q5jY";

export function orderSecret() {
  return process.env.ORDER_SECRET || "";
}

export class DbError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`db ${status}`);
  }
}

export async function rpc<T>(fn: string, args: Record<string, unknown>, userToken?: string | null): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${userToken || SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) throw new DbError(res.status, body);
  return body as T;
}

export type OrderTotals = { ref: string; subtotal: number; shipping: number; total: number };
