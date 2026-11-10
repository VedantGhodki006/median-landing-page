import type { Metadata } from "next";
import { termsOfUse as doc } from "@/lib/legal";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: doc.meta.title,
  description: doc.meta.description,
  openGraph: { title: doc.meta.title, description: doc.meta.description },
  twitter: { title: doc.meta.title, description: doc.meta.description },
};

export default function TermsPage() {
  return <LegalPage doc={doc} />;
}
