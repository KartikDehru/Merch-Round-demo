"use client";

import { TryScreen } from "@/components/try-chrome";
import { LinkButton } from "@/components/ui";
import { useTry } from "@/lib/try-store";

export default function TryMissPage() {
  const { state } = useTry();
  const pledged = Math.min(state.pledged, state.target - 1);

  return (
    <TryScreen
      step={6}
      title="Not this time"
      footer={
        <div className="space-y-2">
          <LinkButton href="/try" variant="secondary" size="lg" className="w-full">
            Start a new round
          </LinkButton>
          <LinkButton href="/try/done" variant="brick" size="lg" className="w-full">
            Finish the demo
          </LinkButton>
        </div>
      }
    >
      <p className="font-display text-[40px] leading-none">
        {pledged} <span className="text-mute">/</span> {state.target}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-ash">
        Nothing is printed and nobody is charged. Fans get the failed-round email. Bringing your own stock to the show is your call — Merch Round doesn&apos;t print for a miss.
      </p>
      <dl className="mt-6 space-y-2 border border-line p-4 text-[14px]">
        <div className="flex justify-between">
          <dt className="text-ash">Fans told</dt>
          <dd className="font-semibold">{pledged}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ash">Charged</dt>
          <dd className="font-semibold">A$0</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ash">Printed</dt>
          <dd className="font-semibold">Nothing</dd>
        </div>
      </dl>
    </TryScreen>
  );
}
