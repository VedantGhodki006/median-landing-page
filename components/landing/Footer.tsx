import { brand, footer } from "@/lib/content";
import { Logo } from "./Logo";

function SocialIcon({ kind }: { kind: "linkedin" | "x" }) {
  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden md:mt-40">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div className="flex flex-col gap-4">
            <Logo className="text-[24px]" />
            <p className="text-[14px] text-muted-fg">{brand.tagline}</p>
            <span className="mt-2 inline-flex w-fit items-center rounded-full border border-line px-3 py-1 text-[12px] text-muted-fg">
              {brand.madeIn}
            </span>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-12"
          >
            {footer.columns.map((col) => (
              <div key={col.title}>
                <p className="text-[13px] text-faint">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[13px] text-muted-fg transition-colors hover:text-fg"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-6 md:mt-24">
          <div className="flex items-center justify-between gap-6">
            <ul className="flex flex-wrap gap-x-7 gap-y-2">
              {footer.legal.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[13px] text-muted-fg transition-colors hover:text-fg"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="flex gap-2">
              {footer.social.map((s) => (
                <li key={s.kind}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-8 place-items-center rounded-md text-muted-fg transition-colors hover:text-fg"
                  >
                    <SocialIcon kind={s.kind} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[13px] text-faint">{footer.copyright}</p>
        </div>
      </div>

      {/* Giant halftone wordmark, bottom-cropped */}
      <div aria-hidden className="mt-16 h-[17vw] overflow-hidden select-none md:mt-20">
        <p className="halftone-text text-center text-[29vw] leading-[0.8] font-semibold tracking-[-0.06em]">
          {brand.name}
        </p>
      </div>
    </footer>
  );
}
