"use client";

import Image from "next/image";
import type { Dictionary } from "@/content/dictionary";
import { business, flavors, type Lang } from "@/content/site";
import { bottles } from "@/content/media";
import { LineBottle, WhatsAppIcon } from "./Brand";
import { useCart } from "./CartContext";
import { orderMessage, waLink } from "@/lib/whatsapp";

export function Order({ t, lang }: { t: Dictionary; lang: Lang }) {
  const { cart, setQty, clear, total } = useCart();
  const message = orderMessage(lang, cart);

  return (
    <section id="order" data-ink="#202823" className="relative bg-stone text-forest-ink">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-[var(--gutter)] py-20 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16 md:py-36">
        <div>
          <p data-reveal className="eyebrow text-[12px] text-forest md:text-[13px]">
            {t.order.eyebrow}
          </p>
          <h2 data-reveal className="font-display mt-4 text-[clamp(36px,8.5vw,96px)] leading-[1.05]">
            {t.order.title}
          </h2>
          <p data-reveal className="mt-5 max-w-[42ch] text-[15px] leading-[1.7] opacity-80 md:text-[17px]">
            {t.order.line}
          </p>

          <ul className="mt-10 flex flex-col gap-3 md:mt-14">
            {flavors.map((f) => {
              const q = cart[f.id] ?? 0;
              const m = bottles[f.id]?.views["000"] ?? null;
              return (
                <li
                  key={f.id}
                  data-reveal
                  className="flex items-center gap-4 rounded-[28px] border bg-white/40 p-3 pe-4 transition-colors duration-500 md:gap-6 md:p-4 md:pe-6"
                  style={{ borderColor: q > 0 ? f.bg : "rgba(32,40,35,0.12)" }}
                >
                  <span
                    className="arch relative flex h-[76px] w-[56px] shrink-0 items-end justify-center overflow-hidden pb-1 md:h-[96px] md:w-[72px]"
                    style={{ background: f.bg, color: f.ink }}
                    aria-hidden="true"
                  >
                    {m ? (
                      <Image src={m.src} alt="" width={m.width} height={m.height} sizes="40px" className="h-[86%] w-auto" />
                    ) : (
                      <LineBottle label="" className="h-[86%] w-auto" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-[19px] leading-tight md:text-[24px]">{f.name[lang]}</span>
                      {f.seasonal ? (
                        <span className="arch-soft border border-current/40 px-2.5 pt-0.5 text-[11px] leading-[18px] opacity-80">
                          {t.order.seasonalTag}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-[13px] leading-snug opacity-80 md:text-[15px]">
                      {f.description[lang]}
                    </span>
                  </span>
                  <span
                    className="flex shrink-0 items-center rounded-full border border-forest-ink/15 bg-white/60"
                    role="group"
                    aria-label={`${t.order.quantity}: ${f.name[lang]}`}
                  >
                    <button
                      type="button"
                      onClick={() => setQty(f.id, q - 1)}
                      disabled={q === 0}
                      aria-label={`${t.order.decrease}: ${f.name[lang]}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-[20px] transition-opacity disabled:opacity-30"
                    >
                      −
                    </button>
                    <output className="ltr w-6 text-center text-[16px] tabular-nums" aria-live="polite">
                      {q}
                    </output>
                    <button
                      type="button"
                      onClick={() => setQty(f.id, q + 1)}
                      aria-label={`${t.order.increase}: ${f.name[lang]}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-[20px]"
                    >
                      +
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* WhatsApp preview */}
        <div className="md:pt-40">
          <div data-reveal className="sticky top-[calc(var(--header-h)+56px)] mt-12 rounded-[24px] bg-forest px-5 pt-10 pb-6 text-sage md:mt-0 md:px-8 md:pb-8">
            {/* Arch tab on top, like the label */}
            <span className="arch absolute start-1/2 -top-11 flex h-14 w-28 -translate-x-1/2 items-end justify-center bg-forest pb-1 rtl:translate-x-1/2" aria-hidden="true">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-forest-ink">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
            </span>
            <div className="flex items-center justify-between border-b border-sage/15 pb-4">
              <span className="flex items-center gap-3">
                <span>
                  <span className="block text-[15px]">{t.order.preview}</span>
                  <span className="ltr block text-[12px] opacity-85">{business.whatsappLocal}</span>
                </span>
              </span>
              {total > 0 ? (
                <button type="button" onClick={clear} className="h-11 px-2 text-[13px] underline-offset-4 opacity-80 hover:underline">
                  {t.order.clear}
                </button>
              ) : null}
            </div>

            <div className="mt-6 flex">
              <p
                className="relative max-w-[92%] whitespace-pre-line rounded-[18px] rounded-se-[4px] bg-sage-soft px-4 py-3 text-[15px] leading-[1.7] text-forest-ink"
                aria-live="polite"
              >
                {message}
              </p>
            </div>
            {total === 0 ? <p className="mt-4 text-[13px] opacity-85">{t.order.empty}</p> : null}

            <a
              href={waLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-sage text-[16px] text-forest-ink transition-transform duration-500 ease-[var(--ease)] hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.order.send}
              {total > 0 ? (
                <span className="ltr opacity-85">
                  · {total} {lang === "en" ? t.order.items : ""}
                </span>
              ) : null}
              {total > 0 && lang === "ar" ? <span className="opacity-85">{t.order.items}</span> : null}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
