import { flavors } from "@/content/site";
import { toneOnTone } from "@/lib/color";
import { weaveSvg, weaveSpec } from "@/lib/weave";

export const dynamic = "force-static";

/** Pre-renders every color pair the site uses as a cacheable SVG file. */
export function generateStaticParams() {
  const pairs: Array<[string, string, number?]> = [
    ["#3A473E", "#D6D8B0"],
    ["#2C3730", "#D6D8B0"],
    ["#D6D8B0", "#3A473E"],
    [...toneOnTone("#3A473E"), 2.4],
    ...flavors.map((f) => [...toneOnTone(f.bg), 2.4] as [string, string, number]),
  ];
  return pairs.map(([bg, line, w]) => ({ spec: weaveSpec(bg, line, w) }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ spec: string }> }) {
  const { spec } = await params;
  const m = /^([0-9a-f]{6})-([0-9a-f]{6})-(\d+(?:\.\d+)?)\.svg$/i.exec(spec);
  if (!m) return new Response("Not found", { status: 404 });
  return new Response(weaveSvg(`#${m[1]}`, `#${m[2]}`, Number(m[3])), {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
