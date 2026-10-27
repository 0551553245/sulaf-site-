import { ROLL_VIEWS, bottles } from "@/content/media";
import { flavors } from "@/content/site";
import { lineBottleUrl } from "@/components/Brand";
import type { Wrap } from "./roll";

type BottleKey = string;

export const hasPhotos = (k: BottleKey) => !!bottles[k];

/** What the roller wraps around the cylinder for each bottle: its photos at their angles. */
export function wrapFor(k: BottleKey): Wrap {
  const set = bottles[k];
  if (!set) {
    const f = flavors.find((x) => x.id === k)!;
    // A drawing can't turn convincingly, so it slides in without spinning.
    return { faces: [{ url: lineBottleUrl(f.ink), aspect: 160 / 520, at: 0 }], flat: true };
  }
  return {
    faces: ROLL_VIEWS.map(([v, at]) => ({ url: set.views[v].src, aspect: set.views[v].width / set.views[v].height, at })),
  };
}

