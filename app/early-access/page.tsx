import type { Metadata } from "next";
import { a11y, requestAccess } from "@/lib/content";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { RequestAccess } from "@/components/early-access/RequestAccess";

const { meta } = requestAccess;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: { title: meta.title, description: meta.description },
  twitter: { title: meta.title, description: meta.description },
};

export default function EarlyAccessPage() {
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
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px]"
        />
        <div className="container-page pt-28 pb-24 md:pt-32 md:pb-32">
          <RequestAccess />
        </div>
      </main>
      <Footer />
    </>
  );
}
