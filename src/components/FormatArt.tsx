import { LOGO_PATH, logoTransform } from "./LogoWord";

/**
 * Product illustrations for the B2B format cards: a stainless keg and a can,
 * drawn in the brand's colors (brushed steel tinted toward sage, label in forest
 * with the woven band). Vector, so they stay sharp at any size.
 */

function Steel({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#7d8577" />
      <stop offset="0.18" stopColor="#c9ccc0" />
      <stop offset="0.34" stopColor="#f3f3ea" />
      <stop offset="0.5" stopColor="#b9bdb0" />
      <stop offset="0.78" stopColor="#8d9486" />
      <stop offset="1" stopColor="#5e665a" />
    </linearGradient>
  );
}

/** Small woven-arch band, as on the label. */
function Band({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  const n = Math.floor(w / (h * 0.9));
  const step = w / n;
  return (
    <g fill="none" stroke={color} strokeWidth="1.1" opacity="0.85">
      {Array.from({ length: n }, (_, i) => {
        const cx = x + step * (i + 0.5);
        const r = step * 0.42;
        return (
          <g key={i}>
            <path d={`M${cx - r},${y + h} V${y + r} A${r},${r} 0 0 1 ${cx + r},${y + r} V${y + h}`} />
            <path d={`M${cx - r * 0.55},${y + h} V${y + r} A${r * 0.55},${r * 0.55} 0 0 1 ${cx + r * 0.55},${y + r} V${y + h}`} />
          </g>
        );
      })}
    </g>
  );
}

export function KegArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <defs>
        <Steel id="keg-steel" />
        <linearGradient id="keg-dark" x1="0" x2="1">
          <stop offset="0" stopColor="#4a5247" />
          <stop offset="0.35" stopColor="#9aa093" />
          <stop offset="1" stopColor="#3f463c" />
        </linearGradient>
      </defs>
      {/* floor shadow */}
      <ellipse cx="100" cy="250" rx="70" ry="7" fill="#000" opacity="0.28" />

      {/* bottom chime */}
      <path d="M38 214 h124 v26 c0 6 -28 10 -62 10 s-62 -4 -62 -10 z" fill="url(#keg-steel)" />
      <path d="M38 214 c0 5 28 9 62 9 s62 -4 62 -9" fill="none" stroke="#5e665a" strokeWidth="1.2" />

      {/* body */}
      <path d="M32 58 h136 v156 c0 6 -30 10 -68 10 s-68 -4 -68 -10 z" fill="url(#keg-steel)" />
      {/* rolling rings */}
      {[96, 176].map((y) => (
        <g key={y}>
          <path d={`M30 ${y} h140 v9 c0 5 -31 9 -70 9 s-70 -4 -70 -9 z`} fill="url(#keg-dark)" />
          <path d={`M30 ${y} c0 5 31 9 70 9 s70 -4 70 -9`} fill="none" stroke="#2c3730" strokeWidth="0.8" opacity="0.6" />
        </g>
      ))}
      {/* Sulaf label band on the keg */}
      <rect x="46" y="120" width="108" height="44" rx="4" fill="#202823" />
      <Band x={50} y={148} w={100} h={13} color="#D6D8B0" />
      <path d={LOGO_PATH} transform={logoTransform(100, 142, 17)} fill="#D6D8B0" />

      {/* top chime with handle cut-outs */}
      <path d="M38 22 h124 v40 c0 6 -28 10 -62 10 s-62 -4 -62 -10 z" fill="url(#keg-steel)" />
      <rect x="56" y="30" width="30" height="12" rx="6" fill="#2c3730" />
      <rect x="114" y="30" width="30" height="12" rx="6" fill="#2c3730" />
      <ellipse cx="100" cy="22" rx="62" ry="9" fill="#e9eadf" stroke="#7d8577" strokeWidth="1" />

      {/* spear + coupler + tap line */}
      <ellipse cx="100" cy="21" rx="15" ry="4.5" fill="#9aa093" />
      <rect x="90" y="4" width="20" height="16" rx="3" fill="#202823" />
      <rect x="95" y="0" width="10" height="6" rx="2" fill="#D6D8B0" />
      <path d="M110 10 C132 10 142 2 170 2" fill="none" stroke="#D6D8B0" strokeWidth="3.2" strokeLinecap="round" />
      {/* specular highlight */}
      <rect x="64" y="64" width="7" height="148" rx="3.5" fill="#fff" opacity="0.35" />
    </svg>
  );
}

export function CanArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <defs>
        <Steel id="can-steel" />
        <linearGradient id="can-body" x1="0" x2="1">
          <stop offset="0" stopColor="#151b17" />
          <stop offset="0.3" stopColor="#3a473e" />
          <stop offset="0.42" stopColor="#55665a" />
          <stop offset="0.6" stopColor="#2c3730" />
          <stop offset="1" stopColor="#111613" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="250" rx="52" ry="6" fill="#000" opacity="0.28" />

      {/* body */}
      <path d="M58 40 h84 v190 c0 8 -19 14 -42 14 s-42 -6 -42 -14 z" fill="url(#can-body)" />
      {/* shoulder and base in steel */}
      <path d="M54 40 C54 30 66 24 72 22 h56 c6 2 18 8 18 18 v8 H54 z" fill="url(#can-steel)" />
      <path d="M58 222 h84 v8 c0 8 -19 14 -42 14 s-42 -6 -42 -14 z" fill="url(#can-steel)" />
      {/* lid + tab */}
      <ellipse cx="100" cy="22" rx="28" ry="6" fill="#e9eadf" stroke="#7d8577" strokeWidth="1" />
      <ellipse cx="100" cy="22" rx="22" ry="4" fill="none" stroke="#9aa093" strokeWidth="1" />
      <rect x="92" y="18" width="16" height="6" rx="3" fill="#9aa093" />

      {/* arch tab label, like the bottle */}
      <path d="M66 112 h10 c0 -14 11 -24 24 -24 s24 10 24 24 h10 v94 H66 z" fill="#202823" stroke="#D6D8B0" strokeWidth="0.8" />
      <path d={LOGO_PATH} transform={logoTransform(100, 118, 18)} fill="#D6D8B0" />
      <text x="100" y="134" textAnchor="middle" fill="#D6D8B0" style={{ fontFamily: "var(--font-lat)", fontSize: 7, letterSpacing: 2.5 }}>
        SULAF
      </text>
      <text x="100" y="156" textAnchor="middle" fill="#D6D8B0" style={{ fontFamily: "var(--font-lat)", fontSize: 10, letterSpacing: 1.5 }}>
        KOMBUCHA
      </text>
      <rect x="76" y="164" width="48" height="11" fill="none" stroke="#D6D8B0" strokeWidth="0.8" />
      <Band x={68} y={184} w={64} h={14} color="#D6D8B0" />

      {/* highlight */}
      <rect x="76" y="44" width="5" height="176" rx="2.5" fill="#fff" opacity="0.22" />
    </svg>
  );
}
