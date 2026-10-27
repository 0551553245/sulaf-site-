/**
 * The woven-arch band from the label, rebuilt as a small repeating tile
 * (same geometry as assets/brand/woven-arch-pattern.svg: arches every 33.6,
 * four concentric lines each, two staggered rows). Each arch is drawn over
 * its neighbour with a thick stroke in the ground color, which is what makes
 * the lines look woven.
 */
const STEP = 33.6;
const TILE_W = STEP;
const TILE_H = 128;

function arch(cx: number, top: number, bottom: number, bg: string, line: string, w: number) {
  const occ = `<path d="M${cx - 22.5},${bottom} V${top} A22.5,22.5 0 0 1 ${cx + 22.5},${top} V${bottom}" fill="none" stroke="${bg}" stroke-width="17"/>`;
  const lines = [30, 25, 20, 15]
    .map(
      (r) =>
        `<path d="M${(cx - r).toFixed(1)},${bottom} V${top} A${r},${r} 0 0 1 ${(cx + r).toFixed(1)},${top} V${bottom}" fill="none" stroke="${line}" stroke-width="${w}"/>`,
    )
    .join("");
  return occ + lines;
}

export function weaveSvg(bg: string, line: string, strokeWidth = 2.1) {
  let body = `<rect width="${TILE_W}" height="${TILE_H}" fill="${bg}"/>`;
  const rows: Array<[number, number, number]> = [
    [30, 33, 70],
    [30 + STEP / 2, 93, 131],
  ];
  for (const [cx0, top, bottom] of rows) {
    for (let k = -2; k <= 2; k++) body += arch(cx0 + k * STEP, top, bottom, bg, line, strokeWidth);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_W} ${TILE_H}" width="${TILE_W}" height="${TILE_H}">${body}</svg>`;
}

/** File name served by app/weave/[spec]/route.ts, e.g. "3a473e-d6d8b0-2.1.svg". */
export function weaveSpec(bg: string, line: string, strokeWidth = 2.1) {
  return `${bg.replace("#", "").toLowerCase()}-${line.replace("#", "").toLowerCase()}-${strokeWidth}.svg`;
}

export function weaveUrl(bg: string, line: string, strokeWidth?: number) {
  // The static preview can't serve /weave/*, so it inlines the tile.
  if (process.env.NEXT_PUBLIC_INLINE_WEAVE === "1")
    return `url("data:image/svg+xml,${encodeURIComponent(weaveSvg(bg, line, strokeWidth))}")`;
  return `url("/weave/${weaveSpec(bg, line, strokeWidth)}")`;
}

export const WEAVE_RATIO = TILE_W / TILE_H;
