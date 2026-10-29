"use client";

import { TryScreen } from "@/components/try-chrome";
import { Field, Input, LinkButton } from "@/components/ui";
import { CARD_NOTE } from "@/lib/copy";

export default function FanCardPage() {
  return (
    <TryScreen
      step={2}
      total={6}
      title="Save your card"
      footer={
        <LinkButton href="/try/fan/in" variant="brick" size="lg" className="w-full">
          Save card · nothing charged
        </LinkButton>
      }
    >
      <p className="text-[13px] leading-relaxed text-ash">{CARD_NOTE}</p>
      <p className="mt-3 rounded-[4px] border border-note bg-note/40 px-3 py-2 text-[12px] text-ink">
        Demo fields only. Real product will use Stripe-hosted card fields so numbers never touch our server.
      </p>
      <div className="mt-5 space-y-3">
        <Field label="Card number">
          <Input placeholder="4242 4242 4242 4242" inputMode="numeric" autoComplete="cc-number" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry">
            <Input placeholder="12 / 29" autoComplete="cc-exp" />
          </Field>
          <Field label="CVC">
            <Input placeholder="123" autoComplete="cc-csc" />
          </Field>
        </div>
        <Field label="Name on card">
          <Input placeholder="Sam Taylor" autoComplete="cc-name" />
        </Field>
      </div>
    </TryScreen>
  );
}
