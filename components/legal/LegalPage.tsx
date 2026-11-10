import Link from "next/link";
import type { ReactNode } from "react";
import { a11y } from "@/lib/content";
import { company, type LegalBlock, type LegalDoc } from "@/lib/legal";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

const OTHER = {
  "Privacy Policy": { label: "Terms of Use", href: "/terms" },
  "Terms of Use": { label: "Privacy Policy", href: "/privacy" },
} as Record<string, { label: string; href: string }>;

/** Marks any “[placeholder]” still waiting for real company details. */
function Text({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") ? (
          <mark key={i} className="rounded bg-[#E5B84D]/15 px-1 text-[#F0CF85]">
            {p}
          </mark>
        ) : (
          p
        )
      )}
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return (
      <p>
        <Text>{block}</Text>
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2.5">
      {block.list.map((item) => {
        const [term, text] = typeof item === "string" ? [null, item] : item;
        return (
          <li key={term ?? text} className="relative pl-5">
            <span className="absolute top-[0.7em] left-1 size-1 rounded-full bg-faint" aria-hidden />
            {term && <span className="font-medium text-fg">{term}: </span>}
            <Text>{text}</Text>
          </li>
        );
      })}
    </ul>
  );
}

function Section({ id, title, n, children }: { id: string; title: string; n: number; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <h2 id={`${id}-title`} className="flex items-baseline gap-3 text-[20px] font-medium tracking-[-0.02em] text-fg">
        <span className="font-mono text-[12px] text-faint">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-[15px] leading-[1.7] text-muted-fg">{children}</div>
    </section>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const other = OTHER[doc.title];
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-bright px-3 py-2 text-[13px] font-medium text-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {a11y.skip}
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="relative isolate outline-none">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[420px] w-[1000px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px]"
        />
        <div className="container-page pt-32 pb-12 md:pt-40">
          <header className="max-w-[760px]">
            <p className="text-[13px] text-faint">Legal</p>
            <h1 className="mt-4 text-[38px] leading-tight font-medium tracking-[-0.03em] text-fg md:text-[48px]">
              {doc.title}
            </h1>
            <p className="mt-4 text-[13px] text-faint">Last updated {company.updated}</p>
            <div className="body-copy mt-8 flex flex-col gap-4">
              {doc.intro.map((p) => (
                <p key={p}>
                  <Text>{p}</Text>
                </p>
              ))}
            </div>
          </header>

          <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            <nav aria-label="On this page" className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[12px] text-faint">On this page</p>
                <ol className="mt-4 flex flex-col gap-2.5 border-l border-line">
                  {doc.sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="-ml-px block border-l border-transparent pl-4 text-[13px] leading-snug text-muted-fg transition-colors hover:border-fg hover:text-fg"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
                {other && (
                  <Link
                    href={other.href}
                    className="mt-8 inline-block text-[13px] text-muted-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg"
                  >
                    {other.label} →
                  </Link>
                )}
              </div>
            </nav>

            <div className="flex max-w-[720px] flex-col gap-12">
              {doc.sections.map((s, i) => (
                <Section key={s.id} id={s.id} title={s.title} n={i + 1}>
                  {s.body.map((b, j) => (
                    <Block key={j} block={b} />
                  ))}
                </Section>
              ))}
              {other && (
                <p className="border-t border-line pt-8 text-[14px] text-muted-fg lg:hidden">
                  See also our{" "}
                  <Link href={other.href} className="text-fg underline underline-offset-4">
                    {other.label}
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
