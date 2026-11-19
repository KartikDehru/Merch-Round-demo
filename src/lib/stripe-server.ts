import Stripe from "stripe";

/** Server-side Stripe client. Returns null when test keys aren't configured. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  // Let the installed SDK pick its pinned API version.
  return new Stripe(key);
}

export function stripePublishableKey(): string | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  return key || null;
}

export function stripeConfigured(): boolean {
  return Boolean(getStripe() && stripePublishableKey());
}
