import { a11y } from "@/lib/content";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { LedgerDesk } from "@/components/landing/ledger-desk/LedgerDesk";
import { FeatureBento } from "@/components/landing/FeatureBento";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { AiSection } from "@/components/landing/AiSection";
import { BuiltForIndia } from "@/components/landing/BuiltForIndia";
import { UseCases } from "@/components/landing/UseCases";
import { DesignPartners } from "@/components/landing/DesignPartners";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { AnnouncementPill } from "@/components/landing/AnnouncementPill";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-bright px-3 py-2 text-[13px] font-medium text-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {a11y.skip}
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero figure={<LedgerDesk />} />
        <FeatureBento />
        <BeforeAfter />
        <AiSection />
        <BuiltForIndia />
        <UseCases />
        <DesignPartners />
        <FinalCta />
      </main>
      <Footer />
      <AnnouncementPill />
    </>
  );
}
