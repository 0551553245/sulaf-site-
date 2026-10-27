/**
 * The «سُلاف» logo word as vector outlines (traced once from Layla Pro Arabic Bold
 * and shaped with HarfBuzz), so the font file itself is never published.
 * Swap LOGO_PATH for the owner's official logo SVG when it arrives.
 */
export const LOGO_PATH = "M1847 -1569Q1898 -1518 1898 -1446Q1898 -1374 1847 -1323Q1796 -1272 1724 -1272Q1652 -1272 1601 -1323Q1550 -1374 1550 -1446Q1550 -1518 1601 -1569Q1652 -1620 1724 -1620Q1796 -1620 1847 -1569ZM1708 -1032Q1984 -1032 2210 -965Q2238 -739 2238 -506V0H674Q123 0 123 -614V-649L449 -760V-604Q449 -347 525 -247Q601 -147 791 -147H1370Q1128 -239 1128 -528Q1128 -691 1204 -806Q1280 -921 1409 -976Q1538 -1032 1708 -1032ZM1729 -885Q1604 -885 1536 -789Q1468 -693 1468 -512Q1468 -333 1536 -240Q1603 -147 1729 -147H1911V-864Q1843 -885 1729 -885ZM2445 0V-147H2631V-1196L2957 -1262V-147H3018Q3152 -147 3209 -241Q3266 -335 3266 -508V-1583L3594 -1649V-508Q3594 -442 3596 -410Q3597 -377 3603 -326Q3609 -275 3624 -250Q3640 -225 3666 -197Q3693 -169 3736 -158Q3780 -147 3840 -147H3842Q3850 -147 3855 -142Q3860 -136 3860 -129V-18Q3860 -10 3855 -5Q3850 0 3842 0H3815Q3634 0 3514 -48Q3394 -97 3332 -207Q3253 0 3020 0ZM3829 -2144Q3912 -2144 3989 -2122Q3997 -2059 3997 -1976V-1815H3993H3999Q3982 -1657 3786 -1657H3771L3745 -1702H3763Q3828 -1702 3858 -1726Q3887 -1751 3894 -1815H3812Q3727 -1815 3684 -1854Q3642 -1892 3642 -1976Q3642 -2062 3688 -2103Q3734 -2144 3829 -2144ZM3892 -1860V-2093Q3871 -2099 3835 -2099Q3795 -2099 3773 -2068Q3751 -2036 3751 -1978Q3751 -1920 3773 -1890Q3795 -1860 3835 -1860ZM5445 -911 5772 -979V0H5352Q5164 0 5046 -53Q4928 -106 4873 -227Q4824 -113 4732 -54Q4640 4 4515 4Q4396 4 4304 -49Q4211 -102 4156 -205Q4078 0 3845 0H3837Q3829 0 3824 -5Q3819 -10 3819 -18V-129Q3819 -136 3824 -142Q3829 -147 3837 -147H3843Q3913 -147 3962 -172Q4011 -198 4038 -248Q4066 -297 4078 -360Q4091 -424 4091 -508V-805L4419 -872V-434Q4419 -291 4471 -216Q4523 -141 4611 -141Q4710 -141 4767 -236Q4824 -330 4824 -508V-805L5152 -870V-434Q5152 -398 5152 -378Q5153 -359 5158 -324Q5162 -289 5171 -268Q5180 -248 5198 -222Q5216 -196 5242 -182Q5267 -167 5307 -157Q5347 -147 5398 -147H5445Z";
const X = 123;
const Y = -2144;
const W = 5649;
const H = 2148;
export const LOGO_VIEWBOX = `${X} ${Y} ${W} ${H}`;
/** Units per em of the source outlines (the path is drawn at 2048 units = 1em). */
const UPM = 2048;

/** The word as an inline SVG; `height` follows the surrounding font size. */
export function LogoWord({ className = "", label }: { className?: string; label?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      style={{ height: `${H / UPM}em`, width: "auto" }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      fill="currentColor"
    >
      <path d={LOGO_PATH} />
    </svg>
  );
}

/**
 * SVG transform that places the word inside another SVG, centred on `cx`,
 * sitting on `baseline`, at font size `size` (in that SVG's units).
 */
export function logoTransform(cx: number, baseline: number, size: number) {
  const s = size / UPM;
  return `translate(${(cx - (X + W / 2) * s).toFixed(2)} ${baseline}) scale(${s.toFixed(5)})`;
}
