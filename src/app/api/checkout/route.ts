import { NextResponse } from "next/server";
import { MOYASAR_API, SITE_URL, cleanLines, clip, describe, sign } from "@/lib/shop";
import { DbError, OrderTotals, orderSecret, rpc } from "@/lib/db";

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

  const moyasar = process.env.MOYASAR_SECRET_KEY;
  const channel = moyasar ? "online" : "whatsapp";
  // A signed-in customer's token links the order to their account.
  const userToken = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "") || null;

  const payload = {
    items: lines,
    name,
    phone,
    city: clip(body.city, 60),
    district: clip(body.district, 80),
    address,
    location: clip(body.location, 120),
    note: clip(body.note, 250),
    lang,
  };

  let order: OrderTotals;
  try {
    const rows = await rpc<OrderTotals[]>("create_order", { p: payload, p_channel: channel }, userToken);
    order = rows[0];
  } catch (e) {
    // An expired customer session should not block the order: retry as a guest.
    if (userToken && e instanceof DbError && e.status === 401) {
      try {
        order = (await rpc<OrderTotals[]>("create_order", { p: payload, p_channel: channel }))[0];
      } catch (e2) {
        console.error("create_order failed", e2 instanceof DbError ? e2.body : e2);
        return NextResponse.json({ error: "order_failed" }, { status: 502 });
      }
    } else {
      console.error("create_order failed", e instanceof DbError ? e.body : e);
      return NextResponse.json({ error: "order_failed" }, { status: 502 });
    }
  }

  if (channel === "whatsapp") {
    return NextResponse.json({ whatsapp: true, ...order });
  }

  const metadata: Record<string, string> = {
    order_ref: order.ref,
    items: clip(describe(lines, "ar"), 250),
    name,
    phone,
    city: payload.city,
    address,
    location: payload.location,
    lang,
  };
  for (const k of Object.keys(metadata)) if (!metadata[k]) delete metadata[k];

  const res = await fetch(`${MOYASAR_API}/invoices`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(moyasar + ":").toString("base64"), "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: order.total * 100, // halalas
      currency: "SAR",
      description: `سُلاف ${order.ref}: ${describe(lines, "ar")}`.slice(0, 250),
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

  try {
    await rpc("attach_invoice", { p_ref: order.ref, p_invoice: String(inv.id), p_secret: orderSecret() });
  } catch (e) {
    console.error("attach_invoice failed (is ORDER_SECRET set?)", e instanceof DbError ? e.body : e);
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
