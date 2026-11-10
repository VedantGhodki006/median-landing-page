"use client";

import { useId, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { requestAccess as copy } from "@/lib/content";
import {
  DIAL_CODES,
  FREE_EMAIL_DOMAINS,
  REVENUE_BANDS,
  phoneIssue,
  requestAccessSchema,
  type RequestAccessField,
  type RequestAccessInput,
} from "@/lib/early-access";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EASE } from "@/components/landing/motion";
import { FlowDiagram } from "./FlowDiagram";

type Values = Required<Omit<RequestAccessInput, "company_website" | "revenue">> & {
  revenue: RequestAccessInput["revenue"] | "";
};
type Status = "idle" | "loading" | "success" | "error";

/** Visual order, so a failed submit focuses the first problem on screen. */
const ORDER: RequestAccessField[] = [
  "fullName",
  "designation",
  "company",
  "email",
  "phone",
  "revenue",
  "details",
];

const EMPTY: Values = {
  fullName: "",
  email: "",
  dialCode: "+91",
  phone: "",
  company: "",
  designation: "",
  revenue: "",
  details: "",
};

const f = copy.fields;

/** "9876543210" → "98765 43210" for Indian mobiles; other codes are left as typed. */
function formatPhone(dial: string, raw: string) {
  if (dial !== "+91") return raw.replace(/[^\d\s-]/g, "").slice(0, 18);
  const d = raw.replace(/\D/g, "").slice(0, 10);
  return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
}

const control =
  "w-full min-w-0 rounded-lg border bg-white/[0.03] px-3.5 text-[15px] text-fg transition-[border-color,box-shadow,background-color] outline-none placeholder:text-faint hover:bg-white/[0.045] focus:border-brand/70 focus:bg-white/[0.045] focus:shadow-[0_0_0_3px_var(--accent-soft)]";
const border = (bad: boolean) => (bad ? "border-[#E5484D]/60" : "border-line-strong");

function Field({
  id,
  label,
  note,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  note?: string | null;
  error?: string | null;
  className?: string;
  children: ReactNode;
}) {
  const message = error ?? note;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[14px] font-medium text-fg">
        {label}
      </label>
      {children}
      {message && (
        <p
          id={`${id}-msg`}
          className={cn("text-[12.5px] leading-snug", error ? "text-[#F2A7A9]" : "text-faint")}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export function RequestAccess() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<RequestAccessField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");

  const issues = useMemo(() => {
    const parsed = requestAccessSchema.safeParse(values);
    const map: Partial<Record<RequestAccessField, string>> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as RequestAccessField;
        if (!map[key]) map[key] = issue.message;
      }
    }
    // zod skips the phone refinement while other fields fail, so check it directly.
    map.phone ??= phoneIssue(values.dialCode, values.phone) ?? undefined;
    return map;
  }, [values]);

  const show = (k: RequestAccessField) => (touched[k] || submitted ? (issues[k] ?? null) : null);
  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (status === "error") setStatus("idle");
  };
  const blur = (k: RequestAccessField) => () => setTouched((t) => ({ ...t, [k]: true }));
  const aria = (k: RequestAccessField) => ({
    "aria-invalid": !!show(k) || undefined,
    "aria-describedby": `${id(k)}-msg`,
  });

  const domain = values.email.split("@")[1]?.toLowerCase();
  const personal = !issues.email && !!domain && FREE_EMAIL_DOMAINS.includes(domain);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    setSubmitted(true);
    const first = ORDER.find((k) => issues[k]);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company_website: honeypot || undefined }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="grid overflow-hidden rounded-[20px] border border-line bg-surface-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:grid-cols-2">
      {/* Form panel */}
      <div className="px-6 py-10 sm:px-10 md:py-14 lg:px-14">
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <motion.div
              key="success"
              role="status"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex min-h-[560px] flex-col justify-center gap-5"
            >
              <span className="grid size-11 place-items-center rounded-full bg-brand text-white">
                <Check className="size-5" strokeWidth={3} aria-hidden />
              </span>
              <h1 className="text-[34px] font-medium tracking-[-0.03em] text-fg">
                {copy.success.title}
              </h1>
              <p className="body-copy max-w-[420px]">
                {copy.success.body(values.fullName.trim().split(/\s+/)[0] ?? "")}
              </p>
              <Link
                href="/"
                className="mt-2 inline-flex w-fit items-center gap-1.5 text-[14px] text-muted-fg transition-colors hover:text-fg"
              >
                <ArrowLeft className="size-4" aria-hidden />
                {copy.success.back}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <h1 className="text-[34px] leading-tight font-medium tracking-[-0.03em] text-fg md:text-[38px]">
                {copy.title}
              </h1>
              <p className="body-copy mt-3 max-w-[420px]">{copy.sub}</p>

              <form
                noValidate
                onSubmit={onSubmit}
                className="mt-10 grid gap-x-5 gap-y-6 sm:grid-cols-2"
              >
                <Field id={id("fullName")} label={f.fullName.label} error={show("fullName")}>
                  <input
                    id={id("fullName")}
                    name="fullName"
                    autoComplete="name"
                    placeholder={f.fullName.placeholder}
                    value={values.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    onBlur={blur("fullName")}
                    {...aria("fullName")}
                    className={cn(control, "h-11", border(!!show("fullName")))}
                  />
                </Field>

                <Field id={id("designation")} label={f.designation.label} error={show("designation")}>
                  <input
                    id={id("designation")}
                    name="designation"
                    autoComplete="organization-title"
                    placeholder={f.designation.placeholder}
                    value={values.designation}
                    onChange={(e) => set("designation", e.target.value)}
                    onBlur={blur("designation")}
                    {...aria("designation")}
                    className={cn(control, "h-11", border(!!show("designation")))}
                  />
                </Field>

                <Field
                  id={id("company")}
                  label={f.company.label}
                  error={show("company")}
                  className="sm:col-span-2"
                >
                  <input
                    id={id("company")}
                    name="company"
                    autoComplete="organization"
                    placeholder={f.company.placeholder}
                    value={values.company}
                    onChange={(e) => set("company", e.target.value)}
                    onBlur={blur("company")}
                    {...aria("company")}
                    className={cn(control, "h-11", border(!!show("company")))}
                  />
                </Field>

                <Field
                  id={id("email")}
                  label={f.email.label}
                  error={show("email")}
                  note={personal ? f.email.personalHint : null}
                  className="sm:col-span-2"
                >
                  <input
                    id={id("email")}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={f.email.placeholder}
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    onBlur={blur("email")}
                    {...aria("email")}
                    className={cn(control, "h-11", border(!!show("email")))}
                  />
                </Field>

                <Field id={id("phone")} label={f.phone.label} error={show("phone")}>
                  <div
                    className={cn(
                      "flex h-11 overflow-hidden rounded-lg border bg-white/[0.03] transition-[border-color,box-shadow,background-color] focus-within:border-brand/70 focus-within:bg-white/[0.045] focus-within:shadow-[0_0_0_3px_var(--accent-soft)] hover:bg-white/[0.045]",
                      border(!!show("phone"))
                    )}
                  >
                    <label htmlFor={id("dial")} className="sr-only">
                      {f.phone.dialLabel}
                    </label>
                    <select
                      id={id("dial")}
                      name="dialCode"
                      value={values.dialCode}
                      onChange={(e) => {
                        const dial = e.target.value as Values["dialCode"];
                        setValues((prev) => ({ ...prev, dialCode: dial, phone: formatPhone(dial, prev.phone) }));
                      }}
                      className="border-r border-line bg-transparent pr-1 pl-3 text-[14px] text-muted-fg outline-none"
                    >
                      {DIAL_CODES.map((c) => (
                        <option key={c} value={c} className="bg-surface-1">
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      id={id("phone")}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder={f.phone.placeholder}
                      value={values.phone}
                      onChange={(e) => set("phone", formatPhone(values.dialCode, e.target.value))}
                      onBlur={blur("phone")}
                      {...aria("phone")}
                      className="min-w-0 flex-1 bg-transparent px-3 text-[15px] text-fg tabular-nums outline-none placeholder:text-faint"
                    />
                  </div>
                </Field>

                <Field id={id("revenue")} label={f.revenue.label} error={show("revenue")}>
                  <Select
                    name="revenue"
                    value={values.revenue || undefined}
                    onValueChange={(v) => {
                      set("revenue", v as Values["revenue"]);
                      setTouched((t) => ({ ...t, revenue: true }));
                    }}
                    onOpenChange={(open) => {
                      if (!open) setTouched((t) => ({ ...t, revenue: true }));
                    }}
                  >
                    <SelectTrigger
                      id={id("revenue")}
                      {...aria("revenue")}
                      className={cn(
                        control,
                        "h-11 justify-between data-placeholder:text-faint data-[size=default]:h-11 dark:bg-white/[0.03] dark:hover:bg-white/[0.045]",
                        border(!!show("revenue"))
                      )}
                    >
                      <SelectValue placeholder={f.revenue.placeholder} />
                    </SelectTrigger>
                    <SelectContent className="border border-line bg-surface-1">
                      {REVENUE_BANDS.map((band) => (
                        <SelectItem key={band} value={band}>
                          {band}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  id={id("details")}
                  label={f.details.label}
                  error={show("details")}
                  note={
                    values.details.length > 800
                      ? `${1000 - values.details.length} characters left.`
                      : f.details.hint
                  }
                  className="sm:col-span-2"
                >
                  <textarea
                    id={id("details")}
                    name="details"
                    rows={4}
                    maxLength={1000}
                    placeholder={f.details.placeholder}
                    value={values.details}
                    onChange={(e) => set("details", e.target.value)}
                    onBlur={blur("details")}
                    {...aria("details")}
                    className={cn(
                      control,
                      "min-h-[104px] resize-y py-3 leading-relaxed",
                      border(!!show("details"))
                    )}
                  />
                </Field>

                {/* Honeypot, hidden from people and assistive tech */}
                <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>
                    Website
                    <input
                      type="text"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-bright text-[15px] font-medium text-black transition-colors hover:bg-white/85 disabled:cursor-progress disabled:opacity-80"
                  >
                    {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                    {status === "loading" ? copy.loading : copy.submit}
                  </button>
                  <p
                    role="alert"
                    className={cn(
                      "text-center text-[12.5px]",
                      status === "error" ? "text-[#F2A7A9]" : "text-faint"
                    )}
                  >
                    {status === "error" ? (
                      copy.error
                    ) : (
                      <>
                        {copy.fine} {copy.privacy.before}{" "}
                        <Link
                          href={copy.privacy.href}
                          className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-muted-fg"
                        >
                          {copy.privacy.label}
                        </Link>
                        .
                      </>
                    )}
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Diagram panel */}
      <div className="relative hidden border-l border-line bg-[#0C0D0F] lg:block">
        <FlowDiagram />
      </div>
    </div>
  );
}
