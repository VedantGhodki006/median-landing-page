import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brand, finalCta } from "@/lib/content";
import { Reveal } from "./Reveal";
import { EARLY_ACCESS_ID } from "./earlyAccess";

export function FinalCta() {
  return (
    <section
      id={EARLY_ACCESS_ID}
      aria-labelledby="final-cta-title"
      className="container-page scroll-mt-24 pt-32 md:pt-40"
    >
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[20px] border border-line bg-gradient-to-b from-[#0E0F11] via-[#141518] to-[#0C0D0F] px-6 py-24 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:py-36">
          {/* Faint accent glow + drifting dot texture */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-soft blur-[120px]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1.2px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_55%,#000,transparent)] motion-safe:animate-[dots-drift_18s_linear_infinite]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-[45%] -z-10 h-40 bg-gradient-to-b from-transparent via-white/[0.035] to-transparent"
          />

          <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
            <h2 id="final-cta-title" className="h2">
              {finalCta.title}
            </h2>
            <p className="body-copy mt-5 max-w-[460px]">{finalCta.sub}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link
                href={brand.ctaHref}
                className="group inline-flex h-11 items-center gap-2 rounded-lg bg-bright px-5 text-[15px] font-medium text-black transition-colors hover:bg-white/85"
              >
                {finalCta.cta}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href={finalCta.secondary.href}
                className="text-[14px] text-muted-fg transition-colors hover:text-fg"
              >
                {finalCta.secondary.label}
              </Link>
            </div>
            <p className="mt-4 text-[12px] text-faint">{finalCta.fine}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
