import { cookies } from "next/headers";
import { MOYASAR_API, WHATSAPP, moyasarKey, unsign } from "@/lib/shop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Invoice = { id: string; status: string; amount: number; metadata?: Record<string, string> };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

async function fetchInvoice(id: string): Promise<Invoice | null> {
  try {
    const r = await fetch(`${MOYASAR_API}/invoices/${encodeURIComponent(id)}`, {
      headers: { Authorization: moyasarKey() },
      cache: "no-store",
    });
    return r.ok ? ((await r.json()) as Invoice) : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const jar = await cookies();
  // The signed cookie is the trusted source; Moyasar's own query params are a fallback.
  const id = unsign(jar.get("sulaf_order")?.value) || url.searchParams.get("invoice_id") || url.searchParams.get("id");
  const inv = id ? await fetchInvoice(id) : null;
  const paid = inv?.status === "paid";
  const m = inv?.metadata || {};
  const en = m.lang === "en";

  const T = en
    ? {
        title: paid ? "Thank you, your order is in." : "Payment not completed.",
        body: paid
          ? "We have received your payment. We will message you on WhatsApp to confirm the delivery time."
          : "Your payment did not go through and you were not charged. You can try again, or message us on WhatsApp.",
        ref: "Order number",
        total: "Paid",
        sar: "SAR",
        wa: "Message us on WhatsApp",
        back: paid ? "Back to Sulaf" : "Try again",
      }
    : {
        title: paid ? "شكراً لك، وصلنا طلبك." : "ما اكتمل الدفع.",
        body: paid
          ? "استلمنا الدفع. بنتواصل معك على واتساب ونأكد موعد التوصيل."
          : "الدفع ما تم، وما انخصم منك شي. تقدر تحاول مرة ثانية، أو راسلنا على واتساب.",
        ref: "رقم الطلب",
        total: "المدفوع",
        sar: "ر.س",
        wa: "راسلنا على واتساب",
        back: paid ? "رجوع لسُلاف" : "حاول مرة ثانية",
      };

  const waText = paid
    ? `مرحباً سُلاف، دفعت طلبي.\n${T.ref}: ${m.order_ref || inv?.id}\n${m.items || ""}\n${m.name || ""} ${m.phone || ""}`
    : "مرحباً سُلاف، واجهتني مشكلة في الدفع.";
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`;

  const html = `<!doctype html><html lang="${en ? "en" : "ar"}" dir="${en ? "ltr" : "rtl"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(T.title)} | Sulaf</title><link rel="icon" href="/favicon.ico">
<style>
@font-face{font-family:"Muna";src:url(/store/a-b7ac5f956a.woff2) format("woff2");font-weight:400}
@font-face{font-family:"Muna";src:url(/store/a-9c09b2f0d5.woff2) format("woff2");font-weight:900}
:root{--sand:#EADCC3;--cream:#F3ECDD;--forest:#344038;--ink:#1F2622}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--sand);color:var(--ink);font-family:"Muna",system-ui,sans-serif;padding:24px}
main{max-width:560px;width:100%;text-align:center}
h1{font-weight:900;font-size:clamp(34px,8vw,56px);line-height:1.15;margin:0 0 18px;color:var(--forest)}
p{font-size:18px;line-height:1.7;margin:0 0 28px}
.card{background:var(--cream);padding:20px 24px;margin:0 0 28px;display:grid;gap:10px;text-align:start}
.row{display:flex;justify-content:space-between;gap:16px}.mono{direction:ltr;unicode-bidi:isolate;font-variant-numeric:tabular-nums}
a.btn{display:flex;align-items:center;justify-content:center;height:60px;padding:0 32px;background:var(--forest);color:var(--cream);font-weight:900;font-size:19px;text-decoration:none;margin-top:12px}
a.ghost{background:transparent;color:var(--forest);border:2px solid var(--forest)}
</style></head><body><main>
<h1>${esc(T.title)}</h1><p>${esc(T.body)}</p>
${paid ? `<div class="card"><div class="row"><span>${T.ref}</span><b class="mono">${esc(m.order_ref || inv!.id)}</b></div><div class="row"><span>${T.total}</span><b><span class="mono">${(inv!.amount / 100).toFixed(2).replace(/\.00$/, "")}</span> ${T.sar}</b></div></div>` : ""}
<a class="btn" href="${wa}" target="_blank" rel="noopener">${T.wa}</a>
<a class="btn ghost" href="/">${T.back}</a>
</main></body></html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
