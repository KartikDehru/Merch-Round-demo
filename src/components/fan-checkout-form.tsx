"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CARD_NOTE, SHOW_ROUND } from "@/lib/copy";
import { aud } from "@/lib/demo-math";
import { DELIVERY_FEE, formatCardBrand, formatFanTotal, useTry } from "@/lib/try-store";
import { Button, Field, Input, cx } from "./ui";

type SetupResponse =
  | {
      mode: "stripe";
      publishableKey: string;
      clientSecret: string;
      customerId: string;
      setupIntentId: string;
    }
  | {
      mode: "preview";
      publishableKey: null;
      clientSecret: null;
      customerId: null;
    }
  | { error: string };

type Phase = "details" | "loading" | "ready" | "saving" | "done";

const stripePromiseCache = new Map<string, Promise<Stripe | null>>();

function stripePromiseFor(key: string) {
  let p = stripePromiseCache.get(key);
  if (!p) {
    p = loadStripe(key);
    stripePromiseCache.set(key, p);
  }
  return p;
}

/** Fan demo checkout: save a card via Stripe SetupIntent (test mode), nothing charged. */
export function FanCheckoutForm() {
  const { state, set } = useTry();
  const router = useRouter();
  const [name, setName] = useState(state.fanName || "");
  const [email, setEmail] = useState(state.fanEmail || "");
  const [phase, setPhase] = useState<Phase>("details");
  const [error, setError] = useState<string | null>(null);
  const [setup, setSetup] = useState<Extract<SetupResponse, { mode: string }> | null>(null);

  async function startSetup(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName) {
      setError("Enter the name on the card.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setError("Enter a valid email.");
      return;
    }

    set({ fanName: trimmedName, fanEmail: trimmedEmail });
    setPhase("loading");

    try {
      const res = await fetch("/api/stripe/setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });
      const data = (await res.json()) as SetupResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Could not start checkout.");
        setPhase("details");
        return;
      }
      setSetup(data);
      setPhase("ready");
    } catch {
      setError("Network error. Try again.");
      setPhase("details");
    }
  }

  function onSaved(card: { brand: string; last4: string }) {
    set({ savedCard: card });
    setPhase("done");
    router.push("/try/fan/in");
  }

  if (phase === "ready" && setup?.mode === "stripe") {
    const options: StripeElementsOptions = {
      clientSecret: setup.clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#111111",
          colorBackground: "#ffffff",
          colorText: "#111111",
          colorDanger: "#ff4b1f",
          fontFamily: "Assistant, Helvetica Neue, system-ui, sans-serif",
          borderRadius: "4px",
          spacingUnit: "4px",
        },
        rules: {
          ".Input": { border: "1px solid #e4e4e0", boxShadow: "none", padding: "12px" },
          ".Input:focus": { border: "1px solid #111111", boxShadow: "none" },
          ".Label": { fontWeight: "500", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase" },
        },
      },
    };

    return (
      <div className="space-y-5">
        <OrderSummary />
        <ModeBanner mode="stripe" />
        <Elements stripe={stripePromiseFor(setup.publishableKey)} options={options}>
          <StripeSaveForm
            name={name.trim()}
            email={email.trim().toLowerCase()}
            onSaved={onSaved}
            onBack={() => {
              setSetup(null);
              setPhase("details");
            }}
          />
        </Elements>
      </div>
    );
  }

  if (phase === "ready" && setup?.mode === "preview") {
    return (
      <div className="space-y-5">
        <OrderSummary />
        <ModeBanner mode="preview" />
        <PreviewSaveForm
          name={name.trim()}
          onSaved={onSaved}
          onBack={() => {
            setSetup(null);
            setPhase("details");
          }}
        />
      </div>
    );
  }

  return (
    <form onSubmit={startSetup} className="space-y-5">
      <OrderSummary />
      <p className="text-[13px] leading-relaxed text-ash">{CARD_NOTE}</p>
      <div className="space-y-3">
        <Field label="Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sam Taylor"
            autoComplete="cc-name"
            required
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sam@example.com"
            autoComplete="email"
            required
          />
        </Field>
      </div>
      {error && <p className="text-[14px] text-stop">{error}</p>}
      <Button type="submit" variant="brick" size="lg" className="w-full" disabled={phase === "loading"}>
        {phase === "loading" ? "Opening secure checkout…" : "Continue to card details"}
      </Button>
      <p className="text-center text-[12px] text-ash">Nothing is charged today. Card details go to Stripe.</p>
    </form>
  );
}

function OrderSummary() {
  const { state } = useTry();
  const delivery = state.fanMethod === "delivery";
  const total = formatFanTotal(state.price, state.fanMethod);
  return (
    <div className="rounded-[8px] border border-ink/10 bg-stone px-3 py-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold leading-snug">{SHOW_ROUND.title}</p>
          <p className="mt-1 text-[13px] text-ash">
            Size {state.fanSize} · {delivery ? "Delivery" : "Pickup at the show"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[15px] font-bold tabular">{total}</p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ash">Save only</p>
        </div>
      </div>
      {delivery && (
        <div className="mt-2.5 space-y-1 border-t border-ink/10 pt-2.5 text-[12px] text-ash">
          <div className="flex justify-between gap-3">
            <span>Merch</span>
            <span className="tabular">{aud(state.price)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Delivery</span>
            <span className="tabular">{aud(DELIVERY_FEE)}</span>
          </div>
          <div className="flex justify-between gap-3 font-semibold text-ink">
            <span>Total if it goes ahead</span>
            <span className="tabular">{total}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ModeBanner({ mode }: { mode: "stripe" | "preview" }) {
  if (mode === "stripe") {
    return (
      <div className="rounded-[4px] border border-ink/10 bg-brick-soft px-3 py-2 text-[12px] leading-snug text-ink">
        <span className="font-bold">Stripe test mode.</span> Use card{" "}
        <code className="rounded bg-paper px-1 py-0.5 font-mono text-[11px]">4242 4242 4242 4242</code>, any future
        expiry, any CVC. Nothing is charged.
      </div>
    );
  }
  return (
    <div className="rounded-[4px] border border-note bg-note/50 px-3 py-2 text-[12px] leading-snug text-ink">
      <span className="font-bold">Preview checkout.</span> Stripe keys aren&apos;t on this server yet, so this walkthrough
      simulates a save. Use <code className="rounded bg-paper px-1 py-0.5 font-mono text-[11px]">4242 4242 4242 4242</code>.
    </div>
  );
}

function StripeSaveForm({
  name,
  email,
  onSaved,
  onBack,
}: {
  name: string;
  email: string;
  onSaved: (card: { brand: string; last4: string }) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "Check your card details.");
      setBusy(false);
      return;
    }

    const returnUrl = `${window.location.origin}/try/fan/in`;
    const { setupIntent, error: confirmError } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: returnUrl,
        payment_method_data: {
          billing_details: { name, email },
        },
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message || "Card could not be saved.");
      setBusy(false);
      return;
    }

    if (setupIntent?.status === "succeeded" && setupIntent.id) {
      let brand = "card";
      let last4 = "****";
      const pm = setupIntent.payment_method;
      if (pm && typeof pm !== "string" && pm.card) {
        brand = pm.card.brand || "card";
        last4 = pm.card.last4 || "****";
      } else {
        const res = await fetch(`/api/stripe/setup-intent?id=${encodeURIComponent(setupIntent.id)}`);
        const data = (await res.json()) as { card?: { brand: string; last4: string } };
        if (data.card) {
          brand = data.card.brand;
          last4 = data.card.last4;
        }
      }
      onSaved({ brand, last4 });
      return;
    }

    setError("Card save needs another step. Follow the bank prompt, or try 4242 4242 4242 4242.");
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className={cx("min-h-[120px]", !ready && "animate-pulse rounded-[4px] bg-stone")}>
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { name: "never", email: "never" } },
            wallets: { applePay: "never", googlePay: "never" },
          }}
          onReady={() => setReady(true)}
        />
      </div>
      {error && <p className="text-[14px] text-stop">{error}</p>}
      <Button type="submit" variant="brick" size="lg" className="w-full" disabled={!stripe || !elements || busy || !ready}>
        {busy ? "Saving card with Stripe…" : "Save card · nothing charged"}
      </Button>
      <button type="button" onClick={onBack} className="w-full text-center text-[13px] font-semibold text-ash hover:text-ink">
        ← Change name or email
      </button>
      <StripeMark />
    </form>
  );
}

function PreviewSaveForm({
  name,
  onSaved,
  onBack,
}: {
  name: string;
  onSaved: (card: { brand: string; last4: string }) => void;
  onBack: () => void;
}) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const digits = number.replace(/\D/g, "");
  const brand = useMemo(() => detectBrand(digits), [digits]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (digits !== "4242424242424242") {
      setError("In preview mode, use the Stripe test card 4242 4242 4242 4242.");
      return;
    }
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(expiry.trim())) {
      setError("Enter expiry as MM / YY.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvc.trim())) {
      setError("Enter a 3-digit CVC.");
      return;
    }

    setBusy(true);
    await new Promise((r) => setTimeout(r, 1100));
    onSaved({ brand: "visa", last4: "4242" });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Card number">
        <div className="relative">
          <Input
            value={number}
            onChange={(e) => setNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            autoComplete="cc-number"
            className="pr-16"
            required
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-ash">
            {formatCardBrand(brand)}
          </span>
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Expiry">
          <Input
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="12 / 29"
            inputMode="numeric"
            autoComplete="cc-exp"
            required
          />
        </Field>
        <Field label="CVC">
          <Input
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="123"
            inputMode="numeric"
            autoComplete="cc-csc"
            required
          />
        </Field>
      </div>
      <p className="text-[12px] text-ash">Name on card: {name}</p>
      {error && <p className="text-[14px] text-stop">{error}</p>}
      <Button type="submit" variant="brick" size="lg" className="w-full" disabled={busy}>
        {busy ? "Saving card…" : "Save card · nothing charged"}
      </Button>
      <button type="button" onClick={onBack} className="w-full text-center text-[13px] font-semibold text-ash hover:text-ink">
        ← Change name or email
      </button>
      <StripeMark />
    </form>
  );
}

function StripeMark() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-[11px] text-ash">
      <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden>
        <path
          fill="currentColor"
          d="M13.976 9.15c-2.172-.006-3.353 1.007-3.353 2.767 0 1.78 1.214 2.763 3.353 2.763 1.482 0 2.5-.56 3.05-1.5l-1.31-.76c-.3.54-.9.86-1.72.86-.99 0-1.66-.55-1.66-1.36h5.02c.03-.2.05-.41.05-.62 0-1.96-1.2-3.13-3.43-3.13zm-1.66 2.05c0-.8.62-1.33 1.66-1.33.96 0 1.57.52 1.6 1.33zM6.8 14.58h1.7V5.5H6.8zm9.1-9.08c-1.7 0-2.84.78-3.4 1.7l1.45.84c.32-.55.9-.9 1.75-.9 1.14 0 1.9.7 1.9 1.9v.2c-.5-.3-1.2-.5-2-.5-1.9 0-3.2 1.1-3.2 2.9 0 1.8 1.3 2.9 3.2 2.9.8 0 1.5-.2 2-.5v.4h1.7V9.95c0-2.5-1.5-4.45-3.6-4.45z"
        />
      </svg>
      Secured by Stripe · cards never touch Merch Round servers
    </p>
  );
}

function formatCardNumber(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)} / ${d.slice(2)}`;
}

function detectBrand(digits: string) {
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "card";
}

/** After a 3DS redirect, finish wiring the saved card into try-store. */
export function useStripeReturnHandler() {
  const { set, state } = useTry();
  const [pending, setPending] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get("setup_intent") && params.get("setup_intent_client_secret"));
  });

  useEffect(() => {
    if (!pending || state.savedCard) return;

    const params = new URLSearchParams(window.location.search);
    const intentId = params.get("setup_intent");
    const secret = params.get("setup_intent_client_secret");
    if (!intentId || !secret) {
      queueMicrotask(() => setPending(false));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (key) {
          const stripe = await loadStripe(key);
          const result = await stripe?.retrieveSetupIntent(secret);
          const pm = result?.setupIntent?.payment_method;
          if (!cancelled && pm && typeof pm !== "string" && pm.card) {
            set({
              savedCard: { brand: pm.card.brand || "card", last4: pm.card.last4 || "****" },
            });
            return;
          }
        }
        const res = await fetch(`/api/stripe/setup-intent?id=${encodeURIComponent(intentId)}`);
        const data = (await res.json()) as { card?: { brand: string; last4: string } };
        if (!cancelled && data.card) set({ savedCard: data.card });
      } finally {
        if (!cancelled) {
          setPending(false);
          const url = new URL(window.location.href);
          url.search = "";
          window.history.replaceState({}, "", url.pathname);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pending, set, state.savedCard]);

  return pending && !state.savedCard;
}
