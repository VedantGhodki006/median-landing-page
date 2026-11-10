import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { meta } from "@/lib/content";
import { MotionProvider } from "@/components/landing/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL in production so OG/icon URLs are absolute.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: meta.title,
  description: meta.description,
  applicationName: "Median",
  openGraph: {
    type: "website",
    siteName: "Median",
    title: meta.title,
    description: meta.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0C0E",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <body className="min-h-dvh bg-bg font-sans text-fg">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
