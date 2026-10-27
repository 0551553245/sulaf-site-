/**
 * Every bottle image on the site comes from this file.
 *
 * Each flavor has six views from its rotation sheet (0°, 45°, 90°, 135°, 180°, 225°),
 * cut out by scripts/extract_views.py into /public/media/bottles/<flavor>-<view>.webp.
 * To add or replace a flavor's photos: run the script on its sheet, then add or
 * update its entry below (`width` is the file's real pixel width; all are 900px tall).
 * A flavor without an entry falls back to the line-drawn bottle.
 */
import type { Localized } from "./site";

export const VIEWS = ["000", "045", "090", "135", "180", "225"] as const;
export type View = (typeof VIEWS)[number];

export type Img = { src: string; width: number; height: number };
export type BottleSet = {
  views: Record<View, Img>;
  alt: Localized;
  /** true while the photos are renders with draft labels (shows a small tag). */
  placeholder: boolean;
};

// Paths are written out in full (not built from a template) so tools can find and swap them.
export const bottles: Record<string, BottleSet | undefined> = {
  "pineapple": {
    views: {
      "000": { src: "/media/bottles/pineapple-000.webp", width: 280, height: 900 },
      "045": { src: "/media/bottles/pineapple-045.webp", width: 285, height: 900 },
      "090": { src: "/media/bottles/pineapple-090.webp", width: 276, height: 900 },
      "135": { src: "/media/bottles/pineapple-135.webp", width: 285, height: 900 },
      "180": { src: "/media/bottles/pineapple-180.webp", width: 274, height: 900 },
      "225": { src: "/media/bottles/pineapple-225.webp", width: 288, height: 900 },
    },
    alt: { ar: "زجاجة كمبوتشا سُلاف بنكهة الأناناس", en: "Sulaf Pineapple kombucha bottle" },
    placeholder: false,
  },
  "grape-ginger": {
    views: {
      "000": { src: "/media/bottles/grape-ginger-000.webp", width: 271, height: 900 },
      "045": { src: "/media/bottles/grape-ginger-045.webp", width: 274, height: 900 },
      "090": { src: "/media/bottles/grape-ginger-090.webp", width: 271, height: 900 },
      "135": { src: "/media/bottles/grape-ginger-135.webp", width: 277, height: 900 },
      "180": { src: "/media/bottles/grape-ginger-180.webp", width: 274, height: 900 },
      "225": { src: "/media/bottles/grape-ginger-225.webp", width: 271, height: 900 },
    },
    alt: { ar: "زجاجة كمبوتشا سُلاف بنكهة العنب بالزنجبيل", en: "Sulaf Grapes & Ginger kombucha bottle" },
    placeholder: false,
  },
  "hibiscus-cherry": {
    views: {
      "000": { src: "/media/bottles/hibiscus-cherry-000.webp", width: 285, height: 900 },
      "045": { src: "/media/bottles/hibiscus-cherry-045.webp", width: 287, height: 900 },
      "090": { src: "/media/bottles/hibiscus-cherry-090.webp", width: 288, height: 900 },
      "135": { src: "/media/bottles/hibiscus-cherry-135.webp", width: 290, height: 900 },
      "180": { src: "/media/bottles/hibiscus-cherry-180.webp", width: 284, height: 900 },
      "225": { src: "/media/bottles/hibiscus-cherry-225.webp", width: 290, height: 900 },
    },
    alt: { ar: "زجاجة كمبوتشا سُلاف بنكهة الكركديه والكرز", en: "Sulaf Hibiscus & Cherry kombucha bottle" },
    placeholder: false,
  },
  "apple-cinnamon": {
    views: {
      "000": { src: "/media/bottles/apple-cinnamon-000.webp", width: 285, height: 900 },
      "045": { src: "/media/bottles/apple-cinnamon-045.webp", width: 284, height: 900 },
      "090": { src: "/media/bottles/apple-cinnamon-090.webp", width: 288, height: 900 },
      "135": { src: "/media/bottles/apple-cinnamon-135.webp", width: 291, height: 900 },
      "180": { src: "/media/bottles/apple-cinnamon-180.webp", width: 278, height: 900 },
      "225": { src: "/media/bottles/apple-cinnamon-225.webp", width: 297, height: 900 },
    },
    alt: { ar: "زجاجة كمبوتشا سُلاف بنكهة التفاح والقرفة", en: "Sulaf Apple & Cinnamon kombucha bottle" },
    placeholder: false,
  },
  "lemon-ginger": {
    views: {
      "000": { src: "/media/bottles/lemon-ginger-000.webp", width: 284, height: 900 },
      "045": { src: "/media/bottles/lemon-ginger-045.webp", width: 288, height: 900 },
      "090": { src: "/media/bottles/lemon-ginger-090.webp", width: 271, height: 900 },
      "135": { src: "/media/bottles/lemon-ginger-135.webp", width: 286, height: 900 },
      "180": { src: "/media/bottles/lemon-ginger-180.webp", width: 273, height: 900 },
      "225": { src: "/media/bottles/lemon-ginger-225.webp", width: 289, height: 900 },
    },
    alt: { ar: "زجاجة كمبوتشا سُلاف بنكهة الليمون بالزنجبيل", en: "Sulaf Lemon & Ginger kombucha bottle" },
    placeholder: false,
  },
};

/**
 * Where each view sits around the bottle when it rolls (degrees, 0 = facing you):
 * front label, the icons panel beside it, ingredients opposite, nutrition facts.
 */
export const ROLL_VIEWS: Array<[View, number]> = [
  ["000", 0],
  ["180", 90],
  ["090", 180],
  ["135", -90],
];

/** B2B section image (placeholder render of Sulaf on tap). */
export const b2bImage = {
  src: "/media/b2b-taps.webp",
  width: 1536,
  height: 1024,
  placeholder: true,
};
