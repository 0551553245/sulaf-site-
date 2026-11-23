import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "info@sulav.co").toLowerCase();
const COOKIE = "sulav_admin";
const TTL = 60 * 60 * 24 * 14; // two weeks

function key() {
  const k = process.env.ORDER_SECRET;
  if (!k) throw new Error("ORDER_SECRET is not set");
  return k;
}

const eq = (a: string, b: string) => {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
};

export function checkLogin(email: string, password: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || pw.length < 8) return false;
  return eq(email.trim().toLowerCase(), ADMIN_EMAIL) && eq(password, pw);
}

export function sessionValue() {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  // Changing ADMIN_PASSWORD signs everyone out.
  const v = `admin.${exp}`;
  const sig = createHmac("sha256", key() + (process.env.ADMIN_PASSWORD || "")).update(v).digest("base64url");
  return { value: `${v}.${sig}`, maxAge: TTL, name: COOKIE };
}

export async function isAdmin() {
  try {
    const c = (await cookies()).get(COOKIE)?.value || "";
    const [who, exp, sig] = c.split(".");
    if (who !== "admin" || !exp || !sig || Number(exp) < Date.now() / 1000) return false;
    const good = createHmac("sha256", key() + (process.env.ADMIN_PASSWORD || "")).update(`${who}.${exp}`).digest("base64url");
    return eq(sig, good);
  } catch {
    return false;
  }
}

export const COOKIE_NAME = COOKIE;
