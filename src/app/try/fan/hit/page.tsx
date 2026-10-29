"use client";

import { TryScreen } from "@/components/try-chrome";
import { LinkButton } from "@/components/ui";
import { SHOW_ROUND } from "@/lib/copy";

export default function FanHitPage() {
  return (
    <TryScreen
      step={4}
      total={6}
      title="It hit"
      footer={
        <LinkButton href="/try/fan/pickup" variant="brick" size="lg" className="w-full">
          Show pickup code
        </LinkButton>
      }
    >
      <p className="text-[15px] leading-relaxed text-ash">
        The round hit its number. Your card was charged {SHOW_ROUND.price}. Collect at the show with your pickup code, or watch for a delivery email if you chose postage.
      </p>
      <div className="mt-6 border border-ink bg-brick-soft p-4 text-[14px]">
        <div className="font-semibold">Paid · {SHOW_ROUND.price}</div>
        <div className="mt-1 text-ash">{SHOW_ROUND.title} · Merch Round</div>
      </div>
    </TryScreen>
  );
}
