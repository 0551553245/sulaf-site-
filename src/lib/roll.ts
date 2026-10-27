/**
 * Draws one bottle turned to any angle around its long axis, from photos of it
 * taken at several angles.
 *
 * The body is redrawn as thin vertical slices. Each slice works out which point
 * of the cylinder faces the viewer there and shows the matching column of the
 * photo taken closest to that angle, squeezed by the cylinder's curvature.
 * Near the hand-over between two photos the slice blends both, so the label
 * travels smoothly round the bottle. The neck is round, so it is drawn once,
 * unrotated. A flat face (the line drawing) is never sliced.
 */
export type Face = { url: string; aspect: number; at: number };
/** A bottle's surface: photos placed at their angle around it (degrees, 0 = front). */
export type Wrap = { faces: Face[]; flat?: boolean };

const NECK = 0.46; // fraction of the height above the body (cap, neck, shoulder)
const SOLID = 0.86; // fraction of a photo's width that is solid bottle
const BLEND = 16; // degrees either side of a hand-over where two photos are mixed

const rad = (d: number) => (d * Math.PI) / 180;
const norm = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

export function createRoller(box: HTMLElement) {
  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  root.style.cssText = "position:absolute;inset:0;pointer-events:none";

  const top = document.createElement("div");
  top.style.cssText = "position:absolute;top:0;height:100%;background-size:100% 100%;background-repeat:no-repeat";
  root.appendChild(top);

  const body = document.createElement("div");
  body.style.cssText = `position:absolute;inset:0;clip-path:inset(${NECK * 100}% 0 0 0)`;
  root.appendChild(body);

  const shade = document.createElement("div");
  shade.style.cssText = `position:absolute;top:0;height:100%;clip-path:inset(${NECK * 100}% 0 2% 0);mix-blend-mode:multiply;border-radius:0 0 18% 18%`;
  root.appendChild(shade);

  type Slice = { base: HTMLDivElement; over: HTMLDivElement };
  let slices: Slice[] = [];
  let wrap: Wrap = { faces: [] };

  box.appendChild(root);

  const layer = () => {
    const d = document.createElement("div");
    d.style.cssText = "position:absolute;top:0;height:100%;background-repeat:no-repeat";
    body.appendChild(d);
    return d;
  };

  function build(W: number) {
    const n = Math.max(24, Math.min(72, Math.round(W / 4)));
    if (slices.length === n) return;
    body.replaceChildren();
    slices = Array.from({ length: n }, () => ({ base: layer(), over: layer() }));
  }

  const front = () => wrap.faces.find((f) => f.at === 0) ?? wrap.faces[0];

  function set(w: Wrap) {
    wrap = w;
    top.style.backgroundImage = `url("${front().url}")`;
  }

  function paint(el: HTMLDivElement, face: Face, local: number, phi: number, r: number, H: number, ws: number, i: number, solid: number) {
    const rT = (H * face.aspect) / 2;
    // Sample only the solid middle of a photo: its outer columns are glass edge
    // and antialiased transparency, which would show as see-through bands.
    const rS = rT * solid;
    const scale = Math.min(12, (r * Math.cos(phi)) / (rS * Math.max(0.05, Math.cos(local))));
    const xp = rS * Math.sin(local);
    const img = `url("${face.url}")`;
    if (el.dataset.img !== img) {
      el.style.backgroundImage = img;
      el.dataset.img = img;
    }
    el.style.left = `${i * ws}px`;
    el.style.width = `${ws + 0.75}px`;
    el.style.backgroundSize = `${2 * rT * scale}px ${H}px`;
    el.style.backgroundPosition = `${ws / 2 - (xp + rT) * scale}px 0px`;
  }

  /** theta: how far the bottle has turned, in degrees (0 = front facing you). */
  function render(theta: number) {
    const W = box.clientWidth;
    const H = box.clientHeight;
    const f0 = front();
    const w = H * f0.aspect;
    const r = w / 2;
    top.style.width = `${w}px`;
    top.style.left = `${(W - w) / 2}px`;

    const turning = !wrap.flat && Math.abs(norm(theta)) > 0.01;
    // At rest the plain photo is shown whole: slices only while it turns.
    top.style.clipPath = turning ? `inset(0 0 ${(1 - NECK) * 100}% 0)` : "none";
    body.style.visibility = turning ? "visible" : "hidden";
    shade.style.visibility = turning ? "visible" : "hidden";
    if (!turning) return;

    build(W);
    // How far from rest, 0..1, for the solid-only sampling and the shading.
    const off = Math.abs(Math.sin(rad(theta) / 2));
    const solid = 1 - (1 - SOLID) * off;
    const ws = W / slices.length;

    slices.forEach(({ base, over }, i) => {
      const xs = (i + 0.5) * ws - W / 2;
      if (Math.abs(xs) >= r) {
        base.style.display = over.style.display = "none";
        return;
      }
      const phi = Math.asin(xs / r);
      const surf = norm((phi * 180) / Math.PI - theta);

      // The two photos taken closest to this point of the surface.
      const ranked = wrap.faces
        .map((f) => ({ f, d: Math.abs(norm(surf - f.at)) }))
        .sort((p, q) => p.d - q.d);
      const near = ranked[0];
      const next = ranked[1] ?? ranked[0];
      const half = Math.abs(norm(next.f.at - near.f.at)) / 2 || 180;
      const mix = Math.min(0.5, Math.max(0, (near.d - (half - BLEND)) / (2 * BLEND)));

      base.style.display = "block";
      paint(base, near.f, rad(norm(surf - near.f.at)), phi, r, H, ws, i, solid);
      if (mix > 0.001) {
        over.style.display = "block";
        over.style.opacity = String(mix);
        paint(over, next.f, rad(norm(surf - next.f.at)), phi, r, H, ws, i, solid);
      } else {
        over.style.display = "none";
      }
    });

    // Cylinder shading, strongest while turning so the resting photo isn't changed.
    const k = off * 0.45;
    shade.style.left = `${W / 2 - r}px`;
    shade.style.width = `${2 * r}px`;
    shade.style.background = `linear-gradient(90deg, rgba(0,0,0,${k}) 0%, rgba(0,0,0,0) 30%, rgba(255,255,255,0) 62%, rgba(0,0,0,${k * 0.8}) 100%)`;
  }

  return { set, render, radius: () => (box.clientHeight * front().aspect) / 2, destroy: () => root.remove() };
}
