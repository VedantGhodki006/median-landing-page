import { requestAccessSchema } from "@/lib/early-access";
import { supabase } from "@/lib/supabase";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

// In-memory, per-instance rate limit. Good enough pre-launch; move to a
// shared store (e.g. Redis) once this runs on more than one instance.
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_REQUESTS;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request), Date.now())) {
    return Response.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = requestAccessSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { company_website, ...lead } = parsed.data;

  // Honeypot filled → pretend success so bots don't retry.
  if (company_website) {
    return Response.json({ ok: true });
  }

  // No .select(): anon may insert but not read rows back.
  const { error } = await supabase()
    .from("early_access_requests")
    .insert({
      full_name: lead.fullName,
      email: lead.email,
      dial_code: lead.dialCode,
      phone: lead.phone,
      company: lead.company,
      designation: lead.designation,
      revenue: lead.revenue,
      details: lead.details,
    });

  if (error) {
    console.error("[early-access] insert failed", error.code, error.message);
    return Response.json({ ok: false, error: "Could not save request" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
