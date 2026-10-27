"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/dictionary";
import { business, type Lang } from "@/content/site";
import { b2bImage } from "@/content/media";
import { PlaceholderTag, Weave, WhatsAppIcon } from "./Brand";
import { waLink } from "@/lib/whatsapp";
import { CanArt, KegArt } from "./FormatArt";
import { scrollToTarget } from "@/lib/motion";

type Fields = { name: string; type: string; city: string; format: string; qty: string; contact: string };
const EMPTY: Fields = { name: "", type: "", city: "", format: "", qty: "", contact: "" };
const REQUIRED: Array<keyof Fields> = ["name", "type", "city", "format", "contact"];

/** The pre-filled WhatsApp message, one field per line. */
export function inquiryMessage(t: Dictionary, f: Fields) {
  const F = t.business.form;
  const lines = [
    F.intro,
    `- ${F.name}: ${f.name.trim()}`,
    `- ${F.type}: ${F.types[f.type as keyof typeof F.types]}`,
    `- ${F.city}: ${f.city.trim()}`,
    `- ${F.format}: ${F.formatsOpt[f.format as keyof typeof F.formatsOpt]}`,
  ];
  if (f.qty.trim()) lines.push(`- ${F.qty}: ${f.qty.trim()}`);
  lines.push(`- ${F.contact}: ${f.contact.trim()}`);
  return lines.join("\n");
}

export function Business({ t, lang }: { t: Dictionary; lang: Lang }) {
  const B = t.business;
  const F = B.form;
  const [v, setV] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [tried, setTried] = useState(false);
  const [sentLink, setSentLink] = useState<string | null>(null);

  const missing = (k: keyof Fields) => REQUIRED.includes(k) && !v[k].trim();
  const showErr = (k: keyof Fields) => (tried || touched[k]) && missing(k);
  const set = (k: keyof Fields) => (val: string) => {
    setV((p) => ({ ...p, [k]: val }));
    setSentLink(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    const bad = REQUIRED.find((k) => !v[k].trim());
    if (bad) {
      document.getElementById(`b2b-${bad}`)?.focus();
      return;
    }
    const href = waLink(inquiryMessage(t, v));
    setSentLink(href);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const field = "mt-2 h-12 w-full rounded-[14px] border bg-white/70 px-4 text-[16px] text-forest-ink outline-none transition-colors focus-visible:border-forest focus-visible:outline-2 focus-visible:outline-offset-2";
  const err = (k: keyof Fields) =>
    showErr(k) ? (
      <span id={`b2b-${k}-err`} className="mt-1.5 block text-[13px] font-bold text-[#8a1c12]">
        {k === "type" || k === "format" ? F.chooseOne : F.required}
      </span>
    ) : null;

  const pills = (k: "type" | "format", options: Record<string, string>) => (
    <fieldset aria-describedby={showErr(k) ? `b2b-${k}-err` : undefined}>
      <legend className="text-[14px] font-bold">
        {k === "type" ? F.type : F.format} <span aria-hidden="true">*</span>
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {Object.entries(options).map(([id, label], i) => {
          const on = v[k] === id;
          return (
            <label
              key={id}
              className={`relative inline-flex h-11 cursor-pointer items-center rounded-full border px-4 text-[15px] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                on ? "border-forest bg-forest text-sage" : "border-forest/30 bg-white/60 text-forest-ink hover:border-forest/60"
              }`}
            >
              <input
                id={i === 0 ? `b2b-${k}` : undefined}
                type="radio"
                name={`b2b-${k}`}
                value={id}
                checked={on}
                onChange={() => set(k)(id)}
                onBlur={() => setTouched((p) => ({ ...p, [k]: true }))}
                className="sr-only"
                aria-invalid={showErr(k) || undefined}
              />
              {label}
            </label>
          );
        })}
      </div>
      {err(k)}
    </fieldset>
  );

  const text = (k: "name" | "city" | "qty" | "contact", label: string, opts: { auto?: string; mode?: "numeric" | "text" } = {}) => (
    <div>
      <label htmlFor={`b2b-${k}`} className="text-[14px] font-bold">
        {label}{" "}
        {REQUIRED.includes(k) ? (
          <span aria-hidden="true">*</span>
        ) : (
          <span className="font-normal opacity-75">({F.qtyHint})</span>
        )}
      </label>
      <input
        id={`b2b-${k}`}
        name={k}
        value={v[k]}
        onChange={(e) => set(k)(e.target.value)}
        onBlur={() => setTouched((p) => ({ ...p, [k]: true }))}
        autoComplete={opts.auto}
        inputMode={opts.mode}
        required={REQUIRED.includes(k)}
        aria-invalid={showErr(k) || undefined}
        aria-describedby={showErr(k) ? `b2b-${k}-err` : undefined}
        className={`${field} ${showErr(k) ? "border-[#8a1c12]" : "border-forest/25"}`}
      />
      {err(k)}
    </div>
  );

  return (
    <section id="business" data-ink="#202823" className="relative bg-sage text-forest-ink">
      <Weave bg="#D6D8B0" line="#3A473E" height={44} />
      <div className="mx-auto max-w-[1400px] px-[var(--gutter)] pb-24 pt-16 md:pb-36 md:pt-28">
        {/* Intro + hero image */}
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <div>
            <p data-reveal className="eyebrow text-[12px] text-forest md:text-[13px]">
              {B.eyebrow}
            </p>
            <h2 data-reveal className="font-display mt-4 text-[clamp(36px,7.5vw,88px)] leading-[1.05] [text-wrap:balance]">
              {B.title}
            </h2>
            <p data-reveal className="mt-5 max-w-[38ch] text-[16px] leading-[1.7] md:text-[19px]">
              {B.line}
            </p>
            <a
              data-reveal
              href="#b2b-form"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#b2b-form");
              }}
              className="mt-8 inline-flex h-12 items-center rounded-full bg-forest px-6 text-[15px] text-sage transition-transform duration-500 ease-[var(--ease)] hover:-translate-y-0.5"
            >
              {B.cta}
            </a>
          </div>
          <figure data-reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-[999px] rounded-b-[28px] md:aspect-[3/2] md:rounded-t-[360px]">
              <Image
                src={b2bImage.src}
                alt={B.imageAlt}
                fill
                sizes="(min-width: 768px) 56vw, 100vw"
                className="object-cover object-[50%_60%]"
              />
              {b2bImage.placeholder ? <PlaceholderTag label={t.placeholder} className="bottom-4 start-4" /> : null}
            </div>
          </figure>
        </div>

        {/* Formats */}
        <h3 data-reveal className="font-display mt-24 text-[clamp(26px,4vw,40px)] leading-[1.2] md:mt-32">
          {B.formatsTitle}
        </h3>
        <ul className="mt-8 grid gap-5 md:grid-cols-2 md:gap-8">
          {B.formats.map((f) => (
            <li key={f.id} data-reveal className="overflow-hidden rounded-[28px] border border-forest/15 bg-sage-soft">
              {/* Product in an arch, standing on the woven band */}
              <div className="relative flex h-[300px] items-end justify-center bg-sage-soft pt-8 md:h-[360px]">
                <div className="arch absolute bottom-0 left-1/2 h-[86%] w-[min(62%,300px)] -translate-x-1/2 bg-forest" aria-hidden="true" />
                <div className="arch absolute bottom-0 left-1/2 h-[80%] w-[min(54%,262px)] -translate-x-1/2 border border-sage/25" aria-hidden="true" />
                {f.id === "kegs" ? (
                  <KegArt className="relative z-[1] mb-6 h-[78%] w-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]" />
                ) : (
                  <CanArt className="relative z-[1] mb-6 h-[78%] w-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]" />
                )}
                <Weave bg="#3A473E" line="#D6D8B0" height={24} className="absolute inset-x-0 bottom-0" />
              </div>
              <div className="p-6 md:p-8">
                <h4 className="font-display text-[28px] leading-tight md:text-[36px]">{f.title}</h4>
                <p className="mt-2 text-[16px] md:text-[18px]">{f.line}</p>
                <dl className="mt-5 divide-y divide-forest/15 border-y border-forest/15 text-[15px]">
                  {f.specs.map((s) => (
                    <div key={s.k} className="flex items-center justify-between gap-4 py-3">
                      <dt className="opacity-85">{s.k}</dt>
                      <dd className="ltr font-bold">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          ))}
        </ul>

        {/* How it works */}
        <h3 data-reveal className="font-display mt-20 text-[clamp(26px,4vw,40px)] leading-[1.2] md:mt-28">
          {B.stepsTitle}
        </h3>
        <ol className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0">
          {B.steps.map((s, i) => (
            <li key={s} data-reveal className="relative md:pe-10">
              <div className="flex items-center gap-3">
                <span className="ltr flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-forest text-[13px]">
                  0{i + 1}
                </span>
                {i < B.steps.length - 1 ? (
                  <span className="hidden h-px flex-1 bg-forest/40 md:block" aria-hidden="true">
                    <span className="float-end -mt-[3px] block h-[7px] w-[7px] rotate-45 border-t border-e border-forest/60 rtl:-rotate-[135deg]" />
                  </span>
                ) : null}
              </div>
              <p className="font-display mt-4 text-[20px] leading-[1.3] md:text-[24px]">{s}</p>
            </li>
          ))}
        </ol>

        {/* Trust line */}
        <p data-reveal className="mt-14 flex flex-col gap-1 border-y border-forest/20 py-4 text-[14px] md:flex-row md:flex-wrap md:items-center md:gap-x-3 md:text-[15px]">
          <span className="font-bold">{B.trust[0]}</span>
          <span aria-hidden="true" className="hidden md:inline">·</span>
          <span>
            {B.trust[1]} <span className="ltr tabular-nums">{business.cr}</span>
          </span>
          <span aria-hidden="true" className="hidden md:inline">·</span>
          <span>
            {B.trust[2]} <span className="ltr tabular-nums">{business.vat}</span>
          </span>
        </p>

        {/* Inquiry form */}
        <div id="b2b-form" className="mt-20 grid gap-10 scroll-mt-24 md:mt-28 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-16">
          <div>
            <h3 data-reveal className="font-display text-[clamp(30px,5vw,56px)] leading-[1.1]">
              {F.title}
            </h3>
            <p data-reveal className="mt-4 max-w-[34ch] text-[16px] leading-[1.7]">
              {F.line}
            </p>
          </div>
          <form data-reveal noValidate onSubmit={submit} className="grid gap-6 rounded-[28px] bg-sage-soft p-5 md:grid-cols-2 md:p-9">
            <div className="md:col-span-2">{text("name", F.name, { auto: "organization" })}</div>
            <div className="md:col-span-2">{pills("type", F.types)}</div>
            {text("city", F.city, { auto: "address-level2" })}
            {text("contact", F.contact, { auto: "name" })}
            <div className="md:col-span-2">{pills("format", F.formatsOpt)}</div>
            <div className="md:col-span-2">{text("qty", F.qty)}</div>

            <div className="md:col-span-2">
              {tried && REQUIRED.some((k) => missing(k)) ? (
                <p role="alert" className="mb-4 text-[14px] font-bold text-[#8a1c12]">
                  {F.fix}
                </p>
              ) : null}
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-forest text-[16px] text-sage transition-transform duration-500 ease-[var(--ease)] hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {F.submit}
              </button>
              {sentLink ? (
                <a href={sentLink} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center text-[14px] underline underline-offset-4">
                  {F.fallback}
                </a>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
