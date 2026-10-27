import type { Flavor, Ingredient, Lang } from "@/content/site";

/**
 * Line drawings of each flavor's ingredients, in the label's line language.
 * Every stroke has pathLength=1 so it can draw itself in (see .ing in globals.css).
 */
const L = { pathLength: 1 } as const;

const drawings: Record<Ingredient, React.ReactNode> = {
  pineapple: (
    <>
      <defs>
        <clipPath id="ing-pine-body">
          <ellipse cx="50" cy="64" rx="20" ry="26" />
        </clipPath>
      </defs>
      <ellipse {...L} cx="50" cy="64" rx="20" ry="26" />
      <g clipPath="url(#ing-pine-body)">
        <path {...L} d="M24 46 L70 96 M24 62 L58 99 M36 38 L76 82 M50 36 L80 68" />
        <path {...L} d="M76 46 L30 96 M76 62 L42 99 M64 38 L24 82 M50 36 L20 68" />
      </g>
      <path {...L} d="M50 38 C48 28 42 20 32 16 C42 17 48 23 50 31 C51 21 56 12 66 8 C60 17 55 26 53 38" />
      <path {...L} d="M50 38 C49 27 50 17 52 6" />
      <path {...L} d="M44 38 C40 30 34 27 26 26 C33 30 38 34 40 39" />
      <path {...L} d="M56 38 C60 30 66 27 74 26 C67 30 62 34 60 39" />
    </>
  ),
  "pineapple-slice": (
    <>
      <circle {...L} cx="50" cy="52" r="30" />
      <circle {...L} cx="50" cy="52" r="24" />
      <circle {...L} cx="50" cy="52" r="7" />
      <path {...L} d="M50 45 V28 M50 59 V76 M43 52 H26 M57 52 H74 M45 47 L33 35 M55 57 L67 69 M55 47 L67 35 M45 57 L33 69" />
    </>
  ),
  grapes: (
    <>
      {[
        [36, 46],
        [50, 46],
        [64, 46],
        [43, 58],
        [57, 58],
        [50, 70],
        [36, 70],
        [64, 70],
        [50, 82],
      ].map(([cx, cy], i) => (
        <circle key={i} {...L} cx={cx} cy={cy} r="7" />
      ))}
      <path {...L} d="M50 39 C50 30 54 24 60 19" />
      <path {...L} d="M56 26 C62 16 76 14 84 20 C78 30 66 32 56 26 Z" />
      <path {...L} d="M60 25 C68 23 74 21 80 20" />
    </>
  ),
  ginger: (
    <>
      <path
        {...L}
        d="M14 64 C14 54 26 51 33 56 C34 45 47 40 54 49 C59 40 74 41 75 52 C86 51 92 62 84 69 C78 75 64 71 58 73 C48 80 30 79 22 74 C16 71 14 68 14 64 Z"
      />
      <path {...L} d="M38 58 C40 62 40 67 38 72 M58 52 C60 57 60 63 58 68 M74 56 C76 60 76 64 74 67" />
      <path {...L} d="M54 49 C55 42 58 36 62 32 M33 56 C30 50 26 46 22 44" />
    </>
  ),
  lemon: (
    <>
      <circle {...L} cx="50" cy="52" r="30" />
      <circle {...L} cx="50" cy="52" r="25" />
      <circle {...L} cx="50" cy="52" r="3" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r1 = 5;
        const r2 = 23;
        const x = (r: number) => (50 + r * Math.cos((a * Math.PI) / 180)).toFixed(1);
        const y = (r: number) => (52 + r * Math.sin((a * Math.PI) / 180)).toFixed(1);
        return <path key={a} {...L} d={`M${x(r1)} ${y(r1)} L${x(r2)} ${y(r2)}`} />;
      })}
    </>
  ),
  hibiscus: (
    <>
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          {...L}
          transform={`rotate(${a} 50 52)`}
          d="M50 52 C38 42 34 24 46 16 C50 13 54 13 58 17 C66 26 60 42 50 52 Z"
        />
      ))}
      <path {...L} d="M50 52 C56 44 62 36 70 30" />
      <circle {...L} cx="71" cy="28" r="2.5" />
      <circle {...L} cx="66" cy="27" r="2" />
      <circle {...L} cx="73" cy="33" r="2" />
    </>
  ),
  cherry: (
    <>
      <circle {...L} cx="34" cy="70" r="12" />
      <circle {...L} cx="64" cy="74" r="12" />
      <path {...L} d="M34 58 C38 40 48 26 62 18" />
      <path {...L} d="M64 62 C60 46 60 32 62 18" />
      <path {...L} d="M62 18 C70 9 84 9 90 16 C82 24 70 25 62 18 Z" />
      <path {...L} d="M29 66 C30 63 32 61 35 61" />
    </>
  ),
  apple: (
    <>
      <path
        {...L}
        d="M50 32 C40 24 20 27 20 48 C20 68 35 86 46 86 C49 86 50 84 50 84 C50 84 51 86 54 86 C65 86 80 68 80 48 C80 27 60 24 50 32 Z"
      />
      <path {...L} d="M50 32 C50 24 52 17 57 12" />
      <path {...L} d="M54 22 C59 13 70 11 77 15 C71 22 62 24 54 22 Z" />
      <path {...L} d="M30 46 C30 40 33 36 38 34" />
    </>
  ),
  cinnamon: (
    <>
      <path {...L} d="M18 68 L66 20 M26 76 L74 28" />
      <path {...L} d="M66 20 C70 16 78 24 74 28 C71 30 68 28 70 25" />
      <path {...L} d="M18 68 C14 72 22 80 26 76" />
      <path {...L} d="M32 86 L80 38 M40 94 L88 46" />
      <path {...L} d="M80 38 C84 34 92 42 88 46 C85 48 82 46 84 43" />
      <path {...L} d="M32 86 C28 90 36 98 40 94" />
    </>
  ),
};

/** The two ingredient marks around the bottle on a flavor panel. */
export function IngredientMarks({ f, lang }: { f: Flavor; lang: Lang }) {
  return (
    <div className="ing-layer" aria-hidden="true">
      {f.ingredients.slice(0, 2).map((ing, i) => (
        <figure key={ing.kind} className={`ing ing-${i}`}>
          <span className="ing-float">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ing-art"
            >
              {drawings[ing.kind]}
            </svg>
          </span>
          <figcaption className="ing-cap">
            <span className="ing-rule" />
            {ing.name[lang]}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Small single drawing, e.g. for the order list. */
export function IngredientIcon({ kind, className = "" }: { kind: Ingredient; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {drawings[kind]}
    </svg>
  );
}
