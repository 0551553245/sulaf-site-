import { createHmac, timingSafeEqual } from "node:crypto";

// Single source of truth for prices. The browser's numbers are never trusted.
export const PRICES: Record<number, number> = { 250: 12, 330: 19 };
export const SHIPPING_FEE = 35;
export const FREE_SHIPPING_FROM = 100;

export const FLAVORS: Record<string, { ar: string; en: string }> = {
  grape: { ar: "عنب", en: "Grapes" },
  gg: { ar: "عنب وزنجبيل", en: "Grapes & Ginger" },
  pine: { ar: "أناناس", en: "Pineapple" },
  lemon: { ar: "ليمون وزنجبيل", en: "Lemon & Ginger" },
};

export const WHATSAPP = "966552228689";
export const SITE_URL = (process.env.SITE_URL || "https://www.sulav.co").replace(/\/$/, "");
export const MOYASAR_API = process.env.MOYASAR_API_BASE || "https://api.moyasar.com/v1";

export type Line = { f: string; s: number; n: number };

export function cleanLines(raw: unknown): Line[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) return null;
  const merged = new Map<string, Line>();
  for (const r of raw) {
    const f = String((r as Line)?.f ?? "");
    const s = Number((r as Line)?.s);
    const n = Number((r as Line)?.n);
    if (!FLAVORS[f] || !PRICES[s] || !Number.isInteger(n) || n < 1 || n > 200) return null;
    const k = `${f}|${s}`;
    const prev = merged.get(k);
    merged.set(k, { f, s, n: (prev?.n ?? 0) + n });
  }
  return [...merged.values()];
}

export function totals(lines: Line[]) {
  const subtotal = lines.reduce((a, l) => a + l.n * PRICES[l.s], 0);
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

export function describe(lines: Line[], lang: "ar" | "en") {
  const ml = lang === "ar" ? "مل" : "ml";
  return lines.map((l) => `${FLAVORS[l.f][lang]} ${l.s}${ml} ×${l.n}`).join("، ");
}

export function moyasarKey() {
  const k = process.env.MOYASAR_SECRET_KEY;
  if (!k) throw new Error("MOYASAR_SECRET_KEY is not set");
  return "Basic " + Buffer.from(k + ":").toString("base64");
}

// Signed cookie value so the return page knows which invoice to verify.
function secret() {
  return process.env.ORDER_SIGNING_SECRET || process.env.MOYASAR_SECRET_KEY || "";
}
export function sign(v: string) {
  return v + "." + createHmac("sha256", secret()).update(v).digest("base64url");
}
export function unsign(signed: string | undefined): string | null {
  if (!signed) return null;
  const i = signed.lastIndexOf(".");
  if (i < 1) return null;
  const v = signed.slice(0, i);
  const a = Buffer.from(sign(v));
  const b = Buffer.from(signed);
  return a.length === b.length && timingSafeEqual(a, b) ? v : null;
}

export const clip = (v: unknown, max: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
