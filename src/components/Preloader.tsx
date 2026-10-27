import { Logo } from "./Brand";

/** Pure CSS: draws the arch, lifts after ~1s, never blocks the page. Shown once per session. */
export function Preloader({ label }: { label: string }) {
  return (
    <div className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-forest text-sage" aria-hidden="true">
      <span className="sr-only">{label}</span>
      <div className="relative flex h-[210px] w-[170px] items-center justify-center">
        <svg viewBox="0 0 170 210" className="preloader-arch absolute inset-0 h-full w-full" fill="none">
          <path d="M1 210 V85 A84 84 0 0 1 169 85 V210" stroke="currentColor" strokeWidth="1.5" pathLength={1} />
          <path d="M11 210 V85 A74 74 0 0 1 159 85 V210" stroke="currentColor" strokeWidth="1" opacity="0.5" pathLength={1} />
        </svg>
        <div className="preloader-mark pt-8">
          <Logo size="md" />
        </div>
      </div>
    </div>
  );
}
