"use client";

import { TryScreen } from "@/components/try-chrome";
import { LinkButton } from "@/components/ui";
import { FAILED_ROUND_EMAIL } from "@/lib/copy";

export default function FanMissPage() {
  return (
    <TryScreen
      step={6}
      total={6}
      title="Not this time"
      footer={
        <LinkButton href="/try/done" variant="brick" size="lg" className="w-full">
          Finish the demo
        </LinkButton>
      }
    >
      <div className="border border-line bg-stone p-4 text-[14px] leading-relaxed text-ink">
        <div className="label mb-2">Email from Merch Round</div>
        <p>{FAILED_ROUND_EMAIL}</p>
      </div>
      <p className="mt-4 text-[13px] text-ash">Nothing was printed. You haven&apos;t been charged.</p>
    </TryScreen>
  );
}
