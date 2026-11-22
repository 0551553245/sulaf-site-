import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { MOYASAR_API, SITE_URL, cleanLines, clip, describe, moyasarKey, sign, totals } from "@/lib/shop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const lang = body.lang === "en" ? "en" : "ar";
  const lines = cleanLines(body.items);
  const name = clip(body.name, 80);
  const phone = clip(body.phone, 20).replace(/[^0-9]/g, "").replace(/^966/, "0");
  const address = clip(body.address, 250);
  if (!lines || !name || !address || !/^05[0-9]{8}$/.test(phone)) {
    return NextResponse.json({ error: "invalid_order" }, { status: 400 });
  }

  let auth: string;
  try {
    auth = moyasarKey();
  } catch {
    return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });
  }

  const { subtotal, shipping, total } = totals(lines);
  const ref = "SL-" + Date.now().toString(36).toUpperCase() + randomBytes(2).toString("hex").toUpperCase();

  const metadata: Record<string, string> = {
    order_ref: ref,
    items: clip(describe(lines, "ar"), 250),
    subtotal: String(subtotal),
    shipping: String(shipping),
    name,
    phone,
    city: clip(body.city, 60),
    district: clip(body.district, 80),
    address,
    location: clip(body.location, 120),
    note: clip(body.note, 250),
    lang,
  };
  for (const k of Object.keys(metadata)) if (!metadata[k]) delete metadata[k];

  const res = await fetch(`${MOYASAR_API}/invoices`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: total * 100, // halalas
      currency: "SAR",
      description: `سُلاف ${ref}: ${describe(lines, "ar")}`.slice(0, 250),
      success_url: `${SITE_URL}/api/payment/return`,
      back_url: `${SITE_URL}/`,
      metadata,
    }),
  });
  const inv = await res.json().catch(() => null);
  if (!res.ok || !inv?.id || !inv?.url) {
    console.error("moyasar invoice failed", res.status, inv);
    return NextResponse.json({ error: "gateway_error" }, { status: 502 });
  }

  const out = NextResponse.json({ url: inv.url });
  out.cookies.set("sulaf_order", sign(String(inv.id)), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return out;
}
