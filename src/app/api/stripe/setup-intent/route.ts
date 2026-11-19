import { NextResponse } from "next/server";
import { getStripe, stripeConfigured, stripePublishableKey } from "@/lib/stripe-server";

export const dynamic = "force-dynamic";

/**
 * Creates a Stripe SetupIntent so a fan can save a card without being charged.
 * When Stripe test keys are missing, returns preview mode so the demo still works.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  if (!stripeConfigured()) {
    return NextResponse.json({
      mode: "preview" as const,
      publishableKey: null,
      clientSecret: null,
      customerId: null,
    });
  }

  const stripe = getStripe()!;
  const publishableKey = stripePublishableKey()!;

  try {
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer =
      existing.data[0] ??
      (await stripe.customers.create({
        email,
        name,
        metadata: { source: "try_demo" },
      }));

    if (existing.data[0] && name && customer.name !== name) {
      await stripe.customers.update(customer.id, { name });
    }

    const intent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session",
      allowed_payment_method_types: ["card"],
      metadata: {
        source: "try_demo",
        fan_name: name,
        fan_email: email,
      },
    });

    if (!intent.client_secret) {
      return NextResponse.json({ error: "Could not start card save." }, { status: 500 });
    }

    return NextResponse.json({
      mode: "stripe" as const,
      publishableKey,
      clientSecret: intent.client_secret,
      customerId: customer.id,
      setupIntentId: intent.id,
    });
  } catch (err) {
    console.error("[stripe/setup-intent]", err);
    return NextResponse.json({ error: "Stripe could not start card save. Check your test keys." }, { status: 502 });
  }
}

/** Look up a SetupIntent after return / confirm to show brand + last4. */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id || !id.startsWith("seti_")) {
    return NextResponse.json({ error: "Missing setup intent id." }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  try {
    const intent = await stripe.setupIntents.retrieve(id, { expand: ["payment_method"] });
    const pm = intent.payment_method;
    const card =
      pm && typeof pm !== "string" && pm.card
        ? { brand: pm.card.brand ?? "card", last4: pm.card.last4 ?? "****" }
        : null;

    return NextResponse.json({
      status: intent.status,
      card,
    });
  } catch (err) {
    console.error("[stripe/setup-intent GET]", err);
    return NextResponse.json({ error: "Could not read setup intent." }, { status: 502 });
  }
}
