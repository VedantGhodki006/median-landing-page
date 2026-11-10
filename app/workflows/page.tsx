import type { Metadata } from "next";
import { a11y } from "@/lib/content";
import { workflowsMeta } from "@/lib/workflows";
import { Nav } from "@/components/landing/Nav";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { WorkflowsHero } from "@/components/workflows/WorkflowsHero";
import {
  Controls,
  HowItWorks,
  Templates,
} from "@/components/workflows/WorkflowSections";

export const metadata: Metadata = {
  title: workflowsMeta.title,
  description: workflowsMeta.description,
  openGraph: { title: workflowsMeta.title, description: workflowsMeta.description },
  twitter: { title: workflowsMeta.title, description: workflowsMeta.description },
};

export default function WorkflowsPage() {
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
        <WorkflowsHero />
        <HowItWorks />
        <Templates />
        <Controls />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
