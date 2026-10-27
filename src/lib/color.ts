/** Tiny hex color mixer used for tone-on-tone pattern fills. */
function parse(hex: string) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
export function mix(hex: string, withHex: string, amount: number) {
  const a = parse(hex);
  const b = parse(withHex);
  return (
    "#" +
    a
      .map((v, i) => Math.round(v + (b[i] - v) * amount))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}
export function isLight(hex: string) {
  const [r, g, b] = parse(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}
/** Ground + line colors for the woven pattern inside the giant word. */
export function toneOnTone(bg: string): [string, string] {
  return isLight(bg) ? [mix(bg, "#000000", 0.05), mix(bg, "#000000", 0.17)] : [mix(bg, "#ffffff", 0.05), mix(bg, "#ffffff", 0.19)];
}
