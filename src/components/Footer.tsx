import type { Dictionary } from "@/content/dictionary";
import { business, type Lang } from "@/content/site";
import { Logo, Weave, WhatsAppIcon } from "./Brand";
import { generalLink } from "@/lib/whatsapp";

export function Footer({ t, lang }: { t: Dictionary; lang: Lang }) {
  return (
    <footer data-ink="#D6D8B0" className="relative bg-forest text-sage">
      <Weave bg="#3A473E" line="#D6D8B0" height={56} />
      <div className="mx-auto max-w-[1400px] px-[var(--gutter)] pt-20 pb-10 md:pt-28">
        <div className="flex flex-col items-center text-center">
          <div className="arch flex h-[220px] w-[180px] items-center justify-center border border-sage/40 pt-6 md:h-[300px] md:w-[240px]">
            <Logo size="md" tagline={t.logo.tagline} className="md:scale-125" />
          </div>
          <p className="mt-8 max-w-[34ch] text-[15px] leading-[1.7] opacity-80">{t.footer.tagline}</p>
          <a
            href={generalLink(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-sage px-6 text-[15px] text-forest-ink"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t.wa.float}
          </a>
        </div>

        <dl className="mt-16 grid gap-6 border-t border-sage/15 pt-10 text-[14px] sm:grid-cols-2 md:mt-24 md:grid-cols-4">
          <div>
            <dt className="opacity-80">{t.footer.whatsapp}</dt>
            <dd className="mt-1">
              <a href={generalLink(lang)} target="_blank" rel="noopener noreferrer" className="ltr hover:underline">
                {business.whatsappLocal}
              </a>
            </dd>
          </div>
          <div>
            <dt className="opacity-80">{t.footer.vat}</dt>
            <dd className="mt-1 tabular-nums"><span className="ltr">{business.vat}</span></dd>
          </div>
          <div>
            <dt className="opacity-80">{t.footer.cr}</dt>
            <dd className="mt-1 tabular-nums"><span className="ltr">{business.cr}</span></dd>
          </div>
          <div>
            <dt className="opacity-80">{t.footer.social}</dt>
            <dd className="mt-1 flex flex-col gap-1">
              {business.instagram ? (
                <a href={`https://instagram.com/${business.instagram}`} className="ltr hover:underline">
                  Instagram
                </a>
              ) : (
                <bdi className="opacity-80">[TBD: Instagram]</bdi>
              )}
              {business.tiktok ? (
                <a href={`https://tiktok.com/@${business.tiktok}`} className="ltr hover:underline">
                  TikTok
                </a>
              ) : (
                <bdi className="opacity-80">[TBD: TikTok]</bdi>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 text-[12px] opacity-80 sm:flex-row">
          <p>
            © <span className="ltr">{business.year}</span> {lang === "ar" ? "سُلاف" : "Sulaf"}. {t.footer.rights}.
          </p>
          <div className="flex items-center gap-6">
            <a href={lang === "ar" ? "/en" : "/"} hrefLang={lang === "ar" ? "en" : "ar"} className="hover:underline">
              {t.nav.switchLabel}
            </a>
            <a href="#top" className="hover:underline">
              {t.footer.top}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
