import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Request-access form (/early-access), shared by the page and the API */
/* ------------------------------------------------------------------ */

export const REVENUE_BANDS = [
  "Pre-revenue",
  "Under ₹1 Cr",
  "₹1–10 Cr",
  "₹10–50 Cr",
  "₹50–250 Cr",
  "₹250 Cr+",
] as const;

export const DIAL_CODES = ["+91", "+971", "+65", "+44", "+1"] as const;

/** Domains that are personal rather than company mail. Used for a hint, never to block. */
export const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.co.in",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "rediffmail.com",
  "proton.me",
  "protonmail.com",
];

const digits = (value: string) => value.replace(/\D/g, "");

/** The phone rule, also run on its own by the form (zod skips refinements while other fields fail). */
export function phoneIssue(dialCode: string, phone: string) {
  const n = digits(phone);
  if (dialCode === "+91") return /^[6-9]\d{9}$/.test(n) ? null : "Enter a 10-digit mobile number.";
  return n.length >= 6 && n.length <= 14 ? null : "Enter a valid phone number.";
}

export const requestAccessSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(120),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254)
      .pipe(z.email("Enter a valid work email.")),
    dialCode: z.enum(DIAL_CODES),
    phone: z.string().trim().max(24),
    company: z.string().trim().min(2, "Enter your company name.").max(160),
    designation: z.string().trim().min(2, "Enter your designation.").max(120),
    revenue: z.enum(REVENUE_BANDS, { error: "Pick your annual revenue." }),
    details: z.string().trim().max(1000, "Keep it under 1,000 characters.").default(""),
    // Honeypot: real users never see or fill this field.
    company_website: z.string().max(500).optional(),
  })
  .superRefine((value, ctx) => {
    const message = phoneIssue(value.dialCode, value.phone);
    if (message) ctx.addIssue({ code: "custom", path: ["phone"], message });
  });

export type RequestAccessInput = z.input<typeof requestAccessSchema>;
export type RequestAccessField = keyof RequestAccessInput;
