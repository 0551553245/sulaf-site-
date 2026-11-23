import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { DbError, orderSecret, rpc } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = ["new", "delivering", "delivered", "cancelled"];

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const orders = await rpc<unknown[]>("admin_orders", { p_secret: orderSecret(), p_limit: 500 });
    return NextResponse.json({ orders }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("admin_orders failed", e instanceof DbError ? e.body : e);
    return NextResponse.json({ error: "db" }, { status: 502 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { ref?: string; status?: string };
  if (!b.ref || !STATUSES.includes(String(b.status))) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    await rpc("admin_set_status", { p_secret: orderSecret(), p_ref: String(b.ref), p_status: String(b.status) });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin_set_status failed", e instanceof DbError ? e.body : e);
    return NextResponse.json({ error: "db" }, { status: 502 });
  }
}
