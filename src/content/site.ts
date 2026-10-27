/** Business facts confirmed in docs/CONTENT.md. */
export const business = {
  whatsappLocal: "0552228689",
  whatsappIntl: "966552228689",
  vat: "310173271100003",
  cr: "7002315484",
  year: 2026,
  domain: "sulav.co",
  /** [TBD: Instagram handle] */
  instagram: null as string | null,
  /** [TBD: TikTok handle] */
  tiktok: null as string | null,
};

export const siteUrl = `https://${business.domain}`;

export type Lang = "ar" | "en";
export type Localized = { ar: string; en: string };

/** Ingredient drawings available for the flavor infographics (see Ingredients.tsx). */
export type Ingredient = "pineapple" | "pineapple-slice" | "grapes" | "ginger" | "lemon" | "hibiscus" | "cherry" | "apple" | "cinnamon";

export type Flavor = {
  id: string;
  name: Localized;
  description: Localized;
  seasonal: boolean;
  /** Panel color: the kombucha's own color, sampled from the bottle photos. */
  bg: string;
  /** Text color on the panel. */
  ink: string;
  /** Drawn around the bottle, each with its name. */
  ingredients: Array<{ kind: Ingredient; name: Localized }>;
};

const I = {
  pineapple: { kind: "pineapple", name: { ar: "أناناس", en: "Pineapple" } },
  pineappleSlice: { kind: "pineapple-slice", name: { ar: "شريحة أناناس", en: "Pineapple slice" } },
  grapes: { kind: "grapes", name: { ar: "عنب", en: "Grapes" } },
  ginger: { kind: "ginger", name: { ar: "زنجبيل", en: "Ginger" } },
  lemon: { kind: "lemon", name: { ar: "ليمون", en: "Lemon" } },
  hibiscus: { kind: "hibiscus", name: { ar: "كركديه", en: "Hibiscus" } },
  cherry: { kind: "cherry", name: { ar: "كرز", en: "Cherry" } },
  apple: { kind: "apple", name: { ar: "تفاح", en: "Apple" } },
  cinnamon: { kind: "cinnamon", name: { ar: "قرفة", en: "Cinnamon" } },
} satisfies Record<string, Flavor["ingredients"][number]>;

/** Owner's list (in this order). Descriptions are suggested taste notes, no claims. */
export const flavors: Flavor[] = [
  {
    id: "pineapple",
    name: { ar: "أناناس", en: "Pineapple" },
    description: { ar: "حلاوة استوائية مشرقة.", en: "Bright, tropical sweetness." },
    seasonal: false,
    bg: "#EFA705",
    ink: "#202823",
    ingredients: [I.pineapple, I.pineappleSlice],
  },
  {
    id: "grape-ginger",
    name: { ar: "عنب بالزنجبيل", en: "Grapes & Ginger" },
    description: { ar: "عنب داكن بدفء خفيف من الزنجبيل.", en: "Dark grape with a gentle warmth of ginger." },
    seasonal: false,
    bg: "#7E0A2B",
    ink: "#FFF1EC",
    ingredients: [I.grapes, I.ginger],
  },
  {
    id: "lemon-ginger",
    name: { ar: "ليمون بالزنجبيل", en: "Lemon & Ginger" },
    description: { ar: "ليمون منعش بلمسة دافئة من الزنجبيل.", en: "Fresh lemon with a warm touch of ginger." },
    seasonal: false,
    bg: "#F5C014",
    ink: "#202823",
    ingredients: [I.lemon, I.ginger],
  },
  {
    id: "hibiscus-cherry",
    name: { ar: "كركديه وكرز", en: "Hibiscus & Cherry" },
    description: { ar: "كركديه زهري وكرز بحموضة لطيفة.", en: "Floral hibiscus and cherry with a gentle tartness." },
    seasonal: false,
    bg: "#A10E1F",
    ink: "#FFF1EC",
    ingredients: [I.hibiscus, I.cherry],
  },
  {
    id: "apple-cinnamon",
    name: { ar: "تفاح وقرفة", en: "Apple & Cinnamon" },
    description: { ar: "تفاح دافئ بلمسة قرفة.", en: "Warm apple with a touch of cinnamon." },
    seasonal: true,
    bg: "#CC3F09",
    ink: "#FFF3EA",
    ingredients: [I.apple, I.cinnamon],
  },
];
