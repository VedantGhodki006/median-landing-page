import type { LucideIcon } from "lucide-react";
import {
  BadgeIndianRupee,
  BookOpen,
  CalendarCheck,
  CreditCard,
  FlaskConical,
  GitBranch,
  GitMerge,
  HandCoins,
  History,
  Inbox,
  KeyRound,
  Library,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wallet,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Workflows page copy                                                 */
/* ------------------------------------------------------------------ */

export const workflowsMeta = {
  title: "Workflows — Median",
  description:
    "Custom workflows for finance teams. Agents do the steps, your approvers make the calls, and every action stays on the record.",
};

export const workflowsHero = {
  eyebrow: "Workflows",
  titleLines: ["Custom workflows", "for finance teams."],
  sub: "Turn the way your team already works into workflows Median runs every day. Agents do the steps, your people make the calls.",
  secondary: { label: "Browse templates", href: "#templates" },
  canvasLabel:
    "Example workflow, settlement reconciliation: every day at 07:00 it pulls Razorpay settlements and HDFC statement lines, merges them by UTR, and an agent matches and categorises each one using the chart of accounts, GST rules and past matches. Matched lines are posted and synced to Tally; the three that do not match go to the AI inbox for review.",
};

/* ------------------------------------------------------------------ */
/* Hero canvas: a node graph that runs end to end                      */
/* ------------------------------------------------------------------ */

export type CanvasNodeType = "trigger" | "app" | "merge" | "agent" | "if" | "action";

export interface CanvasNode {
  id: string;
  type: CanvasNodeType;
  title: string;
  sub: string;
  /** Board position and size, in board px. */
  x: number;
  y: number;
  w: number;
  h: number;
  icon?: LucideIcon;
  logo?: string;
  /** The run step on which this node executes. */
  step: number;
  /** Shown on the node once it has run. */
  result: string;
  log: string;
}

export interface CanvasEdge {
  from: string;
  to: string;
  /** Which output of `from` (an if node has two) and which input of `to` (a merge has two). */
  out?: 0 | 1;
  in?: 0 | 1;
  items: string;
}

export const canvas = {
  name: "Settlement reconciliation",
  status: "Active",
  runsLabel: "Runs daily · 07:00",
  board: { w: 1424, h: 380 },
  nodes: [
    {
      id: "schedule",
      type: "trigger",
      title: "Daily at 07:00",
      sub: "Schedule",
      x: 16, y: 134, w: 160, h: 64,
      icon: CalendarCheck,
      step: 1,
      result: "Triggered",
      log: "07:00:00 Schedule fired",
    },
    {
      id: "razorpay",
      type: "app",
      title: "Get settlements",
      sub: "Razorpay",
      x: 226, y: 40, w: 168, h: 64,
      logo: "/logos/razorpay.svg",
      step: 2,
      result: "142 items",
      log: "Pulled 142 Razorpay settlements · ₹38,42,190",
    },
    {
      id: "bank",
      type: "app",
      title: "Get statement",
      sub: "HDFC Bank",
      x: 226, y: 228, w: 168, h: 64,
      logo: "/logos/hdfcbank.svg",
      step: 2,
      result: "156 items",
      log: "Read 156 HDFC statement lines",
    },
    {
      id: "merge",
      type: "merge",
      title: "Merge by UTR",
      sub: "Merge",
      x: 446, y: 134, w: 168, h: 64,
      icon: GitMerge,
      step: 3,
      result: "142 pairs",
      log: "Paired 142 settlements to bank credits by UTR",
    },
    {
      id: "agent",
      type: "agent",
      title: "Match and categorise",
      sub: "Median agent",
      x: 694, y: 128, w: 214, h: 76,
      icon: Sparkles,
      step: 4,
      result: "139 matched",
      log: "Matched 139 · fees and GST split on each",
    },
    {
      id: "check",
      type: "if",
      title: "All matched?",
      sub: "If",
      x: 988, y: 134, w: 164, h: 64,
      icon: GitBranch,
      step: 5,
      result: "139 true · 3 false",
      log: "3 lines need a person: amount differs from settlement",
    },
    {
      id: "post",
      type: "action",
      title: "Post to ledger",
      sub: "Syncs to Tally",
      x: 1232, y: 40, w: 176, h: 64,
      icon: BookOpen,
      step: 6,
      result: "139 posted",
      log: "Posted 139 journal entries · Tally synced",
    },
    {
      id: "inbox",
      type: "action",
      title: "Send to AI inbox",
      sub: "Review",
      x: 1232, y: 228, w: 176, h: 64,
      icon: Inbox,
      step: 6,
      result: "3 to review",
      log: "3 exceptions sent to the AI inbox for review",
    },
  ] satisfies CanvasNode[],
  edges: [
    { from: "schedule", to: "razorpay", items: "1 item" },
    { from: "schedule", to: "bank", items: "1 item" },
    { from: "razorpay", to: "merge", in: 0, items: "142 items" },
    { from: "bank", to: "merge", in: 1, items: "156 items" },
    { from: "merge", to: "agent", items: "142 items" },
    { from: "agent", to: "check", items: "142 items" },
    { from: "check", to: "post", out: 0, items: "139 items" },
    { from: "check", to: "inbox", out: 1, items: "3 items" },
  ] satisfies CanvasEdge[],
  /** Tools the agent can call, attached under it. */
  tools: [
    { label: "Accounts", icon: Library },
    { label: "GST rules", icon: BadgeIndianRupee },
    { label: "Past matches", icon: History },
  ] satisfies { label: string; icon: LucideIcon }[],
  ifLabels: ["true", "false"],
  logTitle: "Execution log",
  logIdle: "Waiting for 07:00…",
  doneLabel: "Run succeeded in 4.2s",
};

export const howItWorks = {
  eyebrow: "How workflows run",
  titleLines: ["Describe it once.", "Median runs it every day."],
  steps: [
    {
      label: "Trigger",
      title: "Start from anything",
      body: "A bill in the inbox, a new bank line, a date on the calendar, or a threshold being crossed.",
      icon: Zap,
    },
    {
      label: "Steps",
      title: "Agents do the legwork",
      body: "Extract, code, match, reconcile and draft entries, using your chart of accounts and past approvals.",
      icon: Sparkles,
    },
    {
      label: "Control",
      title: "People make the calls",
      body: "Route by amount, vendor or entity. Nothing posts until the right person approves it.",
      icon: UserCheck,
    },
  ] satisfies { label: string; title: string; body: string; icon: LucideIcon }[],
};

export const templates = {
  eyebrow: "Templates",
  titleLines: ["Start from a template.", "Make it yours."],
  triggerLabel: "When",
  items: [
    {
      title: "Vendor bill approval",
      trigger: "A bill is received",
      steps: ["Extract and code", "Approve if over ₹50,000", "Post and schedule payment"],
      icon: Receipt,
    },
    {
      title: "Month-end close",
      trigger: "Last working day",
      steps: ["Reconcile every bank", "Book accruals and prepaids", "CA reviews and locks the month"],
      icon: CalendarCheck,
    },
    {
      title: "Weekly payment run",
      trigger: "Every Friday",
      steps: ["Pick bills due next week", "Check TDS on each", "Export a bank file for approval"],
      icon: Wallet,
    },
    {
      title: "Collections follow-up",
      trigger: "Invoice 7 days overdue",
      steps: ["Draft a reminder", "Escalate at 30 days", "Match when the payment lands"],
      icon: HandCoins,
    },
    {
      title: "Expense reimbursement",
      trigger: "A receipt is submitted",
      steps: ["Check against policy", "Manager approves", "Add to the payroll batch"],
      icon: CreditCard,
    },
    {
      title: "GST return prep",
      trigger: "8th of every month",
      steps: ["Pull every sales source", "Reconcile with GSTR-2B", "Send to your CA to file"],
      icon: BadgeIndianRupee,
    },
  ] satisfies { title: string; trigger: string; steps: string[]; icon: LucideIcon }[],
};

export const controls = {
  eyebrow: "Control built in",
  titleLines: ["Automation your auditor", "will actually like."],
  items: [
    {
      title: "Approval chains",
      body: "Route by amount, department, vendor or entity, with a backup when someone is away.",
      icon: GitBranch,
    },
    {
      title: "Maker-checker",
      body: "The person who prepares an entry can never be the one who approves it.",
      icon: ShieldCheck,
    },
    {
      title: "Full audit trail",
      body: "Every step records who did what, when, and from which source document.",
      icon: History,
    },
    {
      title: "Roles and permissions",
      body: "Decide who can build, edit, run or approve each workflow.",
      icon: KeyRound,
    },
    {
      title: "Test before it's live",
      body: "Dry-run a workflow on last month's data before it touches your books.",
      icon: FlaskConical,
    },
    {
      title: "Stays in sync with Tally",
      body: "Approved entries flow to Tally, so your CA keeps working the way they already do.",
      icon: RefreshCw,
    },
  ] satisfies { title: string; body: string; icon: LucideIcon }[],
};
