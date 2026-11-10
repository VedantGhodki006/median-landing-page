import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  BadgeIndianRupee,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CalendarRange,
  FileText,
  Gauge,
  HandCoins,
  Inbox,
  Landmark,
  LayoutGrid,
  LineChart,
  Percent,
  Plug,
  Presentation,
  Receipt,
  RefreshCw,
  ScanLine,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type NavLink = { label: string; href: string };
export type NavFeature = NavLink & { description: string; icon: LucideIcon };

export type NavItem =
  | { kind: "link"; label: string; href: string }
  | {
      kind: "mega";
      label: string;
      panel: { eyebrow: string; title: string; body: string; chips: string[] };
      groupLabel: string;
      items: NavFeature[];
    }
  | { kind: "list"; label: string; items: NavLink[] };

export type Kpi = {
  label: string;
  value: number;
  note: string;
  trend?: string;
};

export type StatusTone = "ok" | "review";

export type SourceRow = {
  source: string;
  how: string;
  updated: string;
  status: string;
  tone: StatusTone;
};

export type InboxItem = {
  title: string;
  detail: string;
  confidence: number;
  action: string;
};

export type FeatureCard = {
  id: "sources" | "drop" | "matching" | "gst" | "reports";
  label: string;
  title: string;
  line: string;
  href: string;
};

export type UseCase = { title: string; href: string; icon: LucideIcon };

export type DesignPartnerCard =
  | { kind: "principle"; quote: string; attribution: string }
  | {
      kind: "testimonial";
      quote: string;
      name: string;
      role: string;
      company: string;
    };

/* ------------------------------------------------------------------ */
/* Brand + meta                                                        */
/* ------------------------------------------------------------------ */

export const category = "Agentic infrastructure for accounting teams";

export const brand = {
  name: "median",
  tagline: category,
  madeIn: "Made in India",
  cta: "Get early access",
  ctaHref: "/early-access",
};

export const meta = {
  title: `Median — ${category}`,
  description:
    "Connect your gateways, banks and stores, or drop in statements. Median keeps your books, cash and GST up to date every day. Get early access.",
};

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const productFeatures: NavFeature[] = [
  {
    label: "Live books",
    href: "#",
    description: "Revenue, cash and runway, current every day.",
    icon: LineChart,
  },
  {
    label: "Automatic matching",
    href: "#",
    description: "Every payment, payout and bank line, matched.",
    icon: ArrowLeftRight,
  },
  {
    label: "AI inbox",
    href: "#",
    description: "Approve what the AI isn't sure about.",
    icon: Inbox,
  },
  {
    label: "GST & TDS",
    href: "#",
    description: "Returns prepared, deductions tracked.",
    icon: BadgeIndianRupee,
  },
  {
    label: "CA workspace",
    href: "#",
    description: "Review, lock the month, export to Tally.",
    icon: UserCheck,
  },
];

const resources: NavLink[] = [
  { label: "Blog", href: "#" },
  { label: "Guides", href: "#" },
  { label: "Working with your CA", href: "#" },
  { label: "Docs", href: "#" },
];

export const navItems: NavItem[] = [
  {
    kind: "mega",
    label: "Product",
    groupLabel: "Platform",
    panel: {
      eyebrow: "Sources",
      title: "Connect or drop",
      body: "Connect your gateways, banks and stores, or drop in any statement. Median takes it from there.",
      chips: [
        "Payment gateways",
        "Banks",
        "Marketplaces",
        "Tally & Zoho",
        "Any CSV or PDF",
      ],
    },
    items: productFeatures,
  },
  { kind: "link", label: "Workflows", href: "/workflows" },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  titleLines: ["Agentic infrastructure", "for accounting teams."],
  /** The H1 reads "Agentic infrastructure for <audience>", cycling the audience. */
  titleLead: "Agentic infrastructure for",
  audiences: ["accounting teams", "finance teams", "CA firms"],
  audienceMs: 2600,
  secondaryCta: { label: "See how workflows run", href: "/workflows" },
  sub: "The AI-native ERP for Indian companies. Connect your banks and gateways, and your books, cash and GST stay current on their own.",
  mockupLabel:
    "Median product preview: the Acme Labs overview with revenue, cash, receivables and GST, revenue across all sources, connected and dropped-in sources, a books workflow and an AI inbox.",
};

export const integrations = {
  label: "Connect the tools you already use, or just drop the file",
  /**
   * Official marks from /public/logos, shown as one grey silhouette. `mark`
   * logos are a symbol only, so the name is set beside them; `height` evens
   * out the optical size of the wordmarks.
   */
  items: [
    { name: "Razorpay", logo: "/logos/razorpay.svg", mark: true, height: 20 },
    { name: "Cashfree", logo: "/logos/cashfree.svg", height: 20 },
    { name: "Stripe", logo: "/logos/stripe.svg", mark: true, height: 18 },
    { name: "PayU", logo: "/logos/payu.svg", height: 26 },
    { name: "Shopify", logo: "/logos/shopify.svg", mark: true, height: 20 },
    { name: "Amazon", logo: "/logos/amazon.svg", height: 24 },
    { name: "Flipkart", logo: "/logos/flipkart.svg", height: 26 },
    { name: "Tally", logo: "/logos/tally.svg", height: 26 },
    { name: "Zoho Books", logo: "/logos/zoho.svg", mark: true, height: 16 },
  ] satisfies { name: string; logo: string; mark?: boolean; height: number }[],
  fileDrop: { name: "Any CSV, Excel or PDF statement", icon: FileText },
};

/* ------------------------------------------------------------------ */
/* Product mockup demo data (Acme Labs)                                */
/* ------------------------------------------------------------------ */

export const mockup = {
  org: "Acme Labs",
  orgInitials: "AL",
  sidebar: [
    {
      group: null,
      items: [{ label: "Overview", icon: LayoutGrid, active: true }],
    },
    {
      group: "Money",
      items: [
        { label: "Revenue", icon: LineChart },
        { label: "Cash", icon: Wallet },
        { label: "Invoices", icon: FileText },
        { label: "Bills", icon: Receipt },
      ],
    },
    {
      group: "Automation",
      items: [
        { label: "AI inbox", icon: Inbox, badge: "7" },
        { label: "Matching", icon: ArrowLeftRight },
        { label: "Sources", icon: Plug },
      ],
    },
    {
      group: "Compliance",
      items: [
        { label: "GST", icon: BadgeIndianRupee },
        { label: "TDS", icon: Percent },
        { label: "Period close", icon: CalendarCheck },
      ],
    },
    {
      group: "Books",
      items: [
        { label: "Ledger", icon: BookOpen },
        { label: "Reports", icon: BarChart3 },
        { label: "Tally sync", icon: RefreshCw },
      ],
    },
  ] as {
    group: string | null;
    items: {
      label: string;
      icon: LucideIcon;
      active?: boolean;
      badge?: string;
    }[];
  }[],
  header: {
    title: "Overview",
    badge: "Live",
    subtitle: "All sources synced · 2 min ago",
  },
  kpis: [
    {
      label: "Revenue this month",
      value: 4862400,
      note: "vs last month",
      trend: "+18.4%",
    },
    { label: "Cash in bank", value: 21408950, note: "Across 2 accounts" },
    { label: "Money owed to you", value: 1245300, note: "9 invoices" },
    { label: "GST payable", value: 386120, note: "Due 20 Nov" },
  ] satisfies Kpi[],
  chart: {
    title: "Revenue across all sources",
    subtitle: "Gross, before fees",
    period: "This month",
    axis: ["1 Nov", "15 Nov", "30 Nov"],
    // Relative daily revenue, 0–1. Deterministic so SSR and client agree.
    bars: [
      0.42, 0.55, 0.48, 0.62, 0.7, 0.38, 0.33, 0.58, 0.66, 0.74, 0.61, 0.8,
      0.45, 0.4, 0.69, 0.77, 0.72, 0.86, 0.64, 0.52, 0.47, 0.83, 0.9, 0.76,
      0.88, 0.71, 0.58, 0.54, 0.93, 1, 0.81, 0.68, 0.74, 0.95, 0.86, 0.62,
      0.57, 0.89, 0.97, 0.84,
    ],
  },
  streams: {
    title: "Revenue by source",
    subtitle: "Share of this month",
    items: [
      { label: "Razorpay", value: 1840000 },
      { label: "Shopify", value: 1125600 },
      { label: "Amazon payouts", value: 796800 },
      { label: "Bank transfers (B2B)", value: 758000 },
      { label: "Cashfree", value: 342000 },
    ],
  },
  sources: {
    title: "Sources",
    columns: ["Source", "How", "Last update", "Status"],
    rows: [
      {
        source: "Razorpay",
        how: "Connected",
        updated: "2 min ago",
        status: "Synced",
        tone: "ok",
      },
      {
        source: "HDFC Bank",
        how: "Statement dropped (PDF)",
        updated: "Today",
        status: "Matched",
        tone: "ok",
      },
      {
        source: "Shopify",
        how: "Connected",
        updated: "10 min ago",
        status: "Synced",
        tone: "ok",
      },
      {
        source: "Amazon Seller",
        how: "Settlement file (CSV)",
        updated: "Yesterday",
        status: "Matched",
        tone: "ok",
      },
      {
        source: "ICICI Bank",
        how: "Statement dropped (Excel)",
        updated: "Today",
        status: "3 to review",
        tone: "review",
      },
    ] satisfies SourceRow[],
  },
  inbox: {
    title: "AI inbox",
    count: "7 to review",
    items: [
      {
        title: "Bank credit ₹1,18,000 from NEXA RETAIL",
        detail: "→ Invoice 0142, TDS ₹2,000 deducted",
        confidence: 96,
        action: "Approve",
      },
      {
        title: "Amazon payout ₹2,46,310",
        detail: "→ sales, fees and TCS split",
        confidence: 93,
        action: "Approve",
      },
      {
        title: "AWS bill ₹84,199",
        detail: "→ Cloud hosting + input GST",
        confidence: 91,
        action: "Approve",
      },
    ] satisfies InboxItem[],
  },
  activity: {
    title: "Activity",
    lines: [
      { kind: "cmd", text: "median sync --all" },
      { kind: "ok", text: "✓ Razorpay, Shopify, Cashfree · 412 transactions" },
      { kind: "cmd", text: "median import hdfc-statement-nov.pdf" },
      { kind: "ok", text: "✓ 189 lines read · 182 matched · 7 to AI inbox" },
      { kind: "cmd", text: "median import amazon-settlement-nov.csv" },
      { kind: "ok", text: "✓ sales, fees and TCS split · payout matched to bank" },
      { kind: "cmd", text: "median gst pack --period 2026-10" },
      { kind: "ok", text: "✓ GSTR-1 ready · 3B summary ready" },
    ] as { kind: "cmd" | "ok"; text: string }[],
  },
  workflow: {
    title: "Books workflow",
    sources: ["Gateways", "Banks", "Stores", "Dropped files"],
    nodes: {
      read: "Read & categorise",
      match: "Match",
      books: "Books updated",
      branch: "Unsure? → AI inbox",
    },
  },
};

/* ------------------------------------------------------------------ */
/* Section headers                                                     */
/* ------------------------------------------------------------------ */

export type SectionHeading = { eyebrow: string; titleLines: string[] };

/* ------------------------------------------------------------------ */
/* Feature bento                                                       */
/* ------------------------------------------------------------------ */

export const features = {
  eyebrow: "Introducing Median",
  titleLines: ["Everything between your money", "and your books, handled"],
  cards: [
    {
      id: "sources",
      label: "Every source",
      title: "Money everywhere. One clear picture.",
      line: "Gateways, banks, marketplaces and COD remittances in one set of books.",
      href: "#",
    },
    {
      id: "drop",
      label: "Statement drop",
      title: "No connector? Just drop the file.",
      line: "PDF, CSV or Excel from any bank or platform. We read it, sort it and match it.",
      href: "#",
    },
    {
      id: "matching",
      label: "Matching",
      title: "Month-end without the spreadsheet.",
      line: "Every payment, payout and bank line matched automatically. You only see what needs a look.",
      href: "#",
    },
    {
      id: "gst",
      label: "GST & TDS",
      title: "Compliance that's ready before you are.",
      line: "GSTR-1 and 3B prepared each month; customer TDS deductions tracked.",
      href: "#",
    },
    {
      id: "reports",
      label: "Reports",
      title: "Numbers your investors can trust.",
      line: "Live P&L, balance sheet, cash and runway, drillable to every entry.",
      href: "#",
    },
  ] satisfies FeatureCard[],
  openLabel: "Learn more about",
};

export const bentoData = {
  sources: {
    items: ["Gateways", "Banks", "Marketplaces", "COD remittances"],
    target: "Your books",
    total: 4862400,
    totalLabel: "Revenue this month",
  },
  drop: {
    file: "icici-statement-nov.xlsx",
    zone: "Drop a PDF, CSV or Excel statement",
    rows: [
      { narration: "UPI/KITE STUDIO", category: "Sales" },
      { narration: "AWS INDIA PVT LTD", category: "Cloud hosting" },
      { narration: "NEFT NEXA RETAIL", category: "Receivable" },
      { narration: "SALARY NOV BATCH", category: "Payroll" },
    ],
  },
  matching: {
    file: "Bank lines · HDFC",
    inboxLabel: "To AI inbox",
    rows: [
      { date: "01 Nov", narration: "RAZORPAY SETTLEMENT", amount: 632899, review: false },
      { date: "02 Nov", narration: "NEFT NEXA RETAIL", amount: 118000, review: false },
      { date: "03 Nov", narration: "AWS INDIA PVT LTD", amount: -84199, review: false },
      { date: "04 Nov", narration: "UPI/RAVI K/37500", amount: 37500, review: true },
      { date: "05 Nov", narration: "AMAZON SELLER PAYOUT", amount: 246310, review: false },
    ],
  },
  gst: {
    month: "November 2026",
    weekdays: ["M", "T", "W", "T", "F", "S", "S"],
    // November 2026 starts on a Sunday → 6 leading blanks (Mon-first grid).
    leadingBlanks: 6,
    days: 30,
    marked: [
      { day: 11, label: "GSTR-1" },
      { day: 20, label: "GSTR-3B" },
    ],
    file: "GSTR-1.json",
  },
  reports: {
    title: "Profit & loss · November",
    rows: [
      { label: "Revenue", value: 4862400 },
      { label: "Cost of sales", value: -1420000 },
      { label: "Gross profit", value: 3442400, strong: true },
      { label: "Operating expenses", value: -4562400 },
      { label: "Net loss", value: -1120000, strong: true },
    ],
    runwayLabel: "Runway",
    runway: "19 months",
    file: "Board pack.pdf",
  },
};

/* ------------------------------------------------------------------ */
/* Before / after                                                      */
/* ------------------------------------------------------------------ */

export const beforeAfter = {
  eyebrow: "What changes",
  titleLines: ["From month-end scramble", "to books that keep up"],
  before: {
    title: "Today: downloads, spreadsheets and follow-ups",
    items: [
      "Statements downloaded and typed in by hand",
      "Payouts never quite match the bank",
      "Real numbers arrive weeks after month-end",
      "GST deadlines become a monthly fire drill",
      "Investor updates take a week to pull together",
    ],
  },
  after: {
    title: "With Median",
    items: [
      "Sources connected or dropped in minutes",
      "Every payout and bank line matched automatically",
      "Revenue, cash and runway current every day",
      "GSTR-1 and 3B ready before the deadline",
      "Board-ready numbers in a click",
    ],
  },
};

/* ------------------------------------------------------------------ */
/* AI section                                                          */
/* ------------------------------------------------------------------ */

export const ai = {
  eyebrow: "AI-native, not AI-added",
  titleLines: ["AI that does the work.", "You keep control."],
  columns: [
    {
      id: "sort",
      title: "It sorts every transaction.",
      body: "Categorises gateway payouts, bank lines and bills, and learns your coding from every approval.",
    },
    {
      id: "match",
      title: "It matches without being asked.",
      body: "Payments to invoices, payouts to the bank, even when a customer has deducted TDS.",
    },
    {
      id: "ask",
      title: "It asks before it guesses.",
      body: "Anything uncertain goes to your inbox with the reason and the source. Nothing posts without a trail.",
    },
  ] as { id: "sort" | "match" | "ask"; title: string; body: string }[],
  sort: [
    { raw: "NEFT/HDFC/ACME CORP/9921", label: "Sales · Acme Corp" },
    { raw: "POS 4411 GOOGLE CLOUD", label: "Cloud hosting" },
    { raw: "IMPS/RENT/NOV/BLR", label: "Office rent" },
    { raw: "CASHFREE SETL 88213", label: "Gateway payout" },
  ],
  match: {
    left: [
      { label: "INV 0142", amount: 118000 },
      { label: "INV 0145", amount: 59000 },
      { label: "INV 0151", amount: 236000 },
    ],
    right: [
      { label: "Nexa Retail", amount: 116000, note: "TDS ₹2,000" },
      { label: "Kite Studio", amount: 59000 },
      { label: "Orbit Foods", amount: 231280, note: "TDS ₹4,720" },
    ],
  },
  ask: {
    title: "UPI credit ₹37,500 · RAVI K",
    guess: "→ Invoice 0156 or 0158?",
    confidence: 72,
    confidenceLabel: "Confidence",
    why: "Why?",
    reason: "Amount matches two open invoices from the same customer.",
    source: "Source: hdfc-statement-nov.pdf, line 112",
  },
  chat: {
    title: "Ask your books",
    question: "How much did we spend on cloud last quarter?",
    answer:
      "₹4,82,300 across AWS and Google Cloud, up 12% on the previous quarter.",
    link: "View 14 entries",
    youLabel: "You",
    medianLabel: "Median",
    sub: "Plain-language answers, every number linked to its source entries.",
  },
};

/* ------------------------------------------------------------------ */
/* Built for India                                                     */
/* ------------------------------------------------------------------ */

export const india = {
  eyebrow: "Made for Indian businesses",
  titleLines: ["Built for how Indian companies", "actually run"],
  items: [
    {
      title: "GST-native",
      body: "GSTR-1 JSON, 2B reconciliation and 3B summaries, prepared every month.",
      icon: BadgeIndianRupee,
    },
    {
      title: "TDS-aware",
      body: "Customer deductions recognised and matched, not left as mystery differences.",
      icon: Percent,
    },
    {
      title: "Any Indian bank",
      body: "Connect, or drop the PDF or Excel statement from any bank.",
      icon: Landmark,
    },
    {
      title: "Lakhs, crores, April to March",
      body: "Indian number format and financial year, by default.",
      icon: CalendarRange,
    },
    {
      title: "Works with Tally",
      body: "Import your history and keep Tally in sync, so your CA's workflow doesn't change.",
      icon: RefreshCw,
    },
    {
      title: "Your CA, in the loop",
      body: "A shared workspace to review, approve and lock each month.",
      icon: UserCheck,
    },
  ] satisfies { title: string; body: string; icon: LucideIcon }[],
};

/* ------------------------------------------------------------------ */
/* Use cases                                                           */
/* ------------------------------------------------------------------ */

export const useCases = {
  label: "What changes for your team",
  items: [
    { title: "Know your\nrunway today", href: "#", icon: Gauge },
    { title: "See revenue across\nevery channel", href: "#", icon: LineChart },
    { title: "Stop chasing\npayments", href: "#", icon: HandCoins },
    { title: "Close the month\nin days", href: "#", icon: CalendarCheck },
    { title: "Never miss a\nGST deadline", href: "#", icon: BadgeIndianRupee },
    { title: "Stop typing\nbills by hand", href: "#", icon: ScanLine },
    { title: "Send investors\nclean numbers", href: "#", icon: Presentation },
    { title: "Work with your CA,\nnot around them", href: "#", icon: Users },
  ] satisfies UseCase[],
};

/* ------------------------------------------------------------------ */
/* Design partners (pre-launch: principles, not testimonials)          */
/* ------------------------------------------------------------------ */

export const designPartners = {
  eyebrow: "Design partners",
  titleLines: ["The best companies run", "their accounting on Median."],
  lead: {
    title: "We're building Median with our first design partners.",
    body: "Indian companies and CA firms get early access, a direct say in what we build, and founder pricing for life.",
    badge: "Design partners",
    linkLabel: "Become a design partner",
    href: "/early-access",
  },
  cards: [
    {
      kind: "principle",
      quote:
        "Connect what you can. Drop the rest. Your books stay current either way.",
      attribution: "Median",
    },
    {
      kind: "principle",
      quote: "AI drafts. Code does the maths. Your CA approves.",
      attribution: "Median",
    },
    {
      kind: "principle",
      quote: "We read your data. We never touch your money.",
      attribution: "Median",
    },
    {
      kind: "principle",
      quote:
        "We set it up with you. CA-led onboarding, not a help-centre link.",
      attribution: "Median",
    },
    {
      kind: "principle",
      quote:
        "Stays in sync with Tally, so your CA keeps working the way they already do.",
      attribution: "Median",
    },
  ] satisfies DesignPartnerCard[],
  principleTag: "Principle",
};

/* ------------------------------------------------------------------ */
/* Final CTA + form                                                    */
/* ------------------------------------------------------------------ */

export const finalCta = {
  title: "Stop waiting for month-end.",
  sub: "Join the early access list. We're onboarding a small group of Indian companies and CA firms first.",
  cta: "Request early access",
  secondary: { label: "See how workflows run", href: "/workflows" },
  fine: "Takes about a minute. No spam.",
};

/* ------------------------------------------------------------------ */
/* Request access page (/early-access)                                 */
/* ------------------------------------------------------------------ */

export const requestAccess = {
  meta: {
    title: "Request early access — Median",
    description:
      "Tell us about your company and your books. We're onboarding a small group of Indian companies and CA firms first.",
  },
  title: "Get early access",
  sub: "See how Median keeps your books, cash and GST current on their own. We're onboarding a small group of Indian companies and CA firms first.",
  fields: {
    fullName: { label: "Full name", placeholder: "Enter your full name" },
    email: {
      label: "Work email",
      placeholder: "you@company.in",
      personalHint: "Looks like a personal address. A work email helps us find your company faster.",
    },
    phone: { label: "Contact number", placeholder: "98765 43210", dialLabel: "Country code" },
    company: { label: "Company name", placeholder: "Enter your company name" },
    designation: { label: "Designation", placeholder: "e.g. Head of Finance" },
    revenue: { label: "Annual revenue", placeholder: "Select revenue" },
    details: {
      label: "Anything else?",
      placeholder: "Tell us how your books run today, or anything you'd like us to know",
      hint: "Optional, up to 1,000 characters.",
    },
  },
  submit: "Request early access",
  loading: "Sending…",
  fine: "We'll only use this to get in touch about early access.",
  privacy: { before: "Read our", label: "Privacy Policy", href: "/privacy" },
  error: "Something went wrong. Please try again.",
  /** The diagram beside the form: sources flow through Median into the books. */
  diagram: {
    sources: [
      { name: "Razorpay", logo: "/logos/razorpay.svg" },
      { name: "Upload bills", icon: Receipt },
      { name: "Other transaction\nsources", icon: LayoutGrid },
    ] as { name: string; logo?: string; icon?: LucideIcon }[],
    output: "Your books",
    caption: "Banks, gateways and marketplaces in. Books that keep up, out.",
  },
  success: {
    title: "You're on the list.",
    body: (name: string) =>
      `Thanks${name ? `, ${name}` : ""}. We've got your details and will be in touch soon to set up a walkthrough.`,
    back: "Back to home",
  },
};


/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const footer = {
  columns: [
    {
      title: "Product",
      links: [
        "Live books",
        "Automatic matching",
        "AI inbox",
        "Reports",
        "CA workspace",
      ],
    },
    {
      title: "Use cases",
      links: ["Founders", "Finance teams", "CA firms", "D2C brands", "SaaS"],
    },
    {
      title: "Integrations",
      links: [
        "Payment gateways",
        "Banks",
        "Marketplaces",
        "Tally",
        "Zoho Books",
        "File upload",
      ],
    },
    {
      title: "Resources",
      links: resources.map((r) => r.label),
    },
    {
      title: "Company",
      links: ["About", "Careers", "Changelog", "Contact"],
    },
  ].map((col) => ({
    title: col.title,
    links: col.links.map((label) => ({
      label,
      href: label === "Changelog" ? "#changelog" : "#",
    })),
  })),
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "#" },
  ],
  social: [
    { label: "Median on LinkedIn", href: "#", kind: "linkedin" as const },
    { label: "Median on X", href: "#", kind: "x" as const },
  ],
  copyright: "© 2026 Median. All rights reserved.",
};

/* ------------------------------------------------------------------ */
/* Announcement pill                                                   */
/* ------------------------------------------------------------------ */

export const announcement = {
  text: "Early access is open for Indian companies",
  link: "Join the list",
  href: "/early-access",
  dismissLabel: "Dismiss announcement",
  storageKey: "median:announcement-dismissed",
};

export const a11y = {
  homeHref: "/#top",
  skip: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  home: "Median home",
};
