"use client";

import { useStripeReturnHandler } from "@/components/fan-checkout-form";
import { TryScreen } from "@/components/try-chrome";
import { LinkButton } from "@/components/ui";
import { SHOW_ROUND } from "@/lib/copy";
import { formatCardBrand, useTry } from "@/lib/try-store";

export default function FanInPage() {
  const { state } = useTry();
  const checking = useStripeReturnHandler();
  const fulfilment = state.fanMethod === "pickup" ? "pickup" : "delivery";
  const card = state.savedCard;

  return (
    <TryScreen
      step={3}
      total={6}
      title="You're in"
      footer={
        <div className="grid gap-2">
          <LinkButton href="/try/fan/hit" variant="secondary" size="lg" className="w-full border-dashed">
            Demo: it hits →
          </LinkButton>
          <LinkButton href="/try/fan/miss" variant="secondary" size="lg" className="w-full border-dashed">
            Demo: it misses →
          </LinkButton>
        </div>
      }
    >
      {checking ? (
        <p className="text-[14px] text-ash">Confirming your saved card with Stripe…</p>
      ) : (
        <p className="text-[15px] leading-relaxed text-ash">
          Your card is saved. Nothing is charged today. We&apos;ll email you before the round closes, and again when it
          hits or misses.
        </p>
      )}

      {card && (
        <div className="mt-5 flex items-center gap-3 rounded-[8px] border border-ink bg-brick-soft px-4 py-3">
          <span className="flex size-10 items-center justify-center rounded-[6px] bg-ink text-[11px] font-bold uppercase tracking-wide text-brick">
            {formatCardBrand(card.brand).slice(0, 4)}
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-bold">
              {formatCardBrand(card.brand)} ···· {card.last4}
            </p>
            <p className="text-[12px] text-ash">Saved with Stripe · ready if the round goes ahead</p>
          </div>
        </div>
      )}

      <div className="mt-6 border border-line bg-stone p-4">
        <div className="label">Your spot</div>
        <p className="mt-2 font-display text-[28px] leading-none">
          {SHOW_ROUND.progress + 1} / {SHOW_ROUND.target}
        </p>
        <p className="mt-2 text-[13px] text-ash">
          {SHOW_ROUND.title} · size {state.fanSize} · {fulfilment}
          {state.fanEmail ? ` · ${state.fanEmail}` : ""}
        </p>
      </div>
    </TryScreen>
  );
}
