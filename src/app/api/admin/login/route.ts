import { NextResponse } from "next/server";
import { COOKIE_NAME, checkLogin, sessionValue } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  if (!process.env.ADMIN_PASSWORD || !process.env.ORDER_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  if (!checkLogin(String(b.email || ""), String(b.password || ""))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return NextResponse.json({ error: "wrong" }, { status: 401 });
  }
  const s = sessionValue();
  const out = NextResponse.json({ ok: true });
  out.cookies.set(s.name, s.value, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: s.maxAge });
  return out;
}

export async function DELETE() {
  const out = NextResponse.json({ ok: true });
  out.cookies.set(COOKIE_NAME, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
  return out;
}
