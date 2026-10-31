import { NextResponse } from "next/server";
import { validateContact, type ContactValues } from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort in-memory throttle (per server instance). Use a shared store for strict limits.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const oneLine = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const values: ContactValues = {
    name: str(raw.name),
    email: str(raw.email),
    subject: str(raw.subject),
    message: str(raw.message),
    website: str(raw.website),
  };

  if (values.website) return NextResponse.json({ ok: false, error: "Rejected." }, { status: 400 });

  const errors = validateContact(values);
  const firstError = Object.values(errors)[0];
  if (firstError) return NextResponse.json({ ok: false, error: firstError, errors }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    // Honest response: nothing was sent, the client shows a mailto fallback.
    return NextResponse.json({ ok: false, configured: false }, { status: 501 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ ok: false, configured: true, error: "Too many messages. Please try again later." }, { status: 429 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: oneLine(values.email),
        subject: `[Portfolio] ${oneLine(values.subject)}`,
        text: `From: ${oneLine(values.name)} <${oneLine(values.email)}>\n\n${values.message}`,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, configured: true, error: "The email provider rejected the message." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, configured: true, error: "Could not reach the email provider." }, { status: 502 });
  }
}
