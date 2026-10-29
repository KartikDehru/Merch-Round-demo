import { NextResponse } from "next/server";
import { sendWaitlistConfirmation } from "@/lib/email";
import { upsertWaitlist, waitlistReady, type WaitlistRole, type WaitlistSource, type WouldUse } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

const ROLES = new Set(["artist", "fan", "other"]);
const SOURCES = new Set(["landing", "demo_end"]);
const WOULD = new Set(["yes", "maybe", "no"]);

export async function POST(req: Request) {
  if (!waitlistReady()) {
    return NextResponse.json({ error: "Waitlist storage is not configured." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const role = String(body.role ?? "") as WaitlistRole;
  const band = body.band != null ? String(body.band).trim() : undefined;
  const source = String(body.source ?? "landing") as WaitlistSource;

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!ROLES.has(role)) {
    return NextResponse.json({ error: "Pick artist, fan, or other." }, { status: 400 });
  }
  if (!SOURCES.has(source)) {
    return NextResponse.json({ error: "Invalid source." }, { status: 400 });
  }

  let feedback: { wouldUse: WouldUse; blocker?: string } | undefined;
  if (body.feedback && typeof body.feedback === "object") {
    const f = body.feedback as Record<string, unknown>;
    const wouldUse = String(f.wouldUse ?? "") as WouldUse;
    if (!WOULD.has(wouldUse)) {
      return NextResponse.json({ error: "Pick Yes, Maybe, or No." }, { status: 400 });
    }
    const blocker = f.blocker != null ? String(f.blocker).trim().slice(0, 1000) : undefined;
    feedback = { wouldUse, blocker: blocker || undefined };
  }

  try {
    const doc = await upsertWaitlist({
      name,
      email,
      role,
      band: band || undefined,
      source,
      feedback,
    });
    const mail = await sendWaitlistConfirmation(email, name);
    return NextResponse.json({ ok: true, emailed: mail.sent, emailError: mail.error, id: doc.email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
