"use client";

import { TryScreen } from "@/components/try-chrome";
import { LinkButton } from "@/components/ui";
import { SHOW_ROUND } from "@/lib/copy";

export default function FanInPage() {
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
      <p className="text-[15px] leading-relaxed text-ash">
        Your card is saved. Nothing is charged today. We&apos;ll email you before the round closes, and again when it hits or misses.
      </p>
      <div className="mt-6 border border-line bg-stone p-4">
        <div className="label">Your spot</div>
        <p className="mt-2 font-display text-[28px] leading-none">
          {SHOW_ROUND.progress + 1} / {SHOW_ROUND.target}
        </p>
        <p className="mt-2 text-[13px] text-ash">{SHOW_ROUND.title} · size M · pickup</p>
      </div>
    </TryScreen>
  );
}
