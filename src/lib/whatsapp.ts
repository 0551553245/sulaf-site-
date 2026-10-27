import { business, flavors, type Lang } from "@/content/site";
import { dictionaries } from "@/content/dictionary";

export type Cart = Record<string, number>;

export function waLink(message: string) {
  return `https://wa.me/${business.whatsappIntl}?text=${encodeURIComponent(message)}`;
}

/** Builds the pre-filled message: one flavor per line, "- name × qty". */
export function orderMessage(lang: Lang, cart: Cart) {
  const t = dictionaries[lang].wa;
  const lines = flavors
    .filter((f) => (cart[f.id] ?? 0) > 0)
    .map((f) => `- ${f.name[lang]} × ${cart[f.id]}`);
  return lines.length ? [t.withFlavors, ...lines].join("\n") : t.general;
}

export const generalLink = (lang: Lang) => waLink(dictionaries[lang].wa.general);
