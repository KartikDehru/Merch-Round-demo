"use client";

import { TryScreen } from "@/components/try-chrome";
import { LinkButton } from "@/components/ui";
import { aud } from "@/lib/demo-math";
import { useTry } from "@/lib/try-store";

export default function TryPaidPage() {
  const { math } = useTry();

  return (
    <TryScreen
      step={5}
      title="Get paid"
      footer={
        <LinkButton href="/try/done" variant="brick" size="lg" className="w-full">
          Finish the demo
        </LinkButton>
      }
    >
      <p className="text-[15px] leading-relaxed text-ash">
        The printer is paid and printing. Your share is released once the printer confirms the items are finished — not at the merch desk.
      </p>
      <div className="mt-6 border border-ink bg-brick-soft p-5">
        <div className="label">Your payout</div>
        <div className="mt-2 font-display text-[36px] leading-none">{aud(math.artist)}</div>
        <p className="mt-2 text-[13px] text-ash">Held until the printer marks the job finished.</p>
      </div>
      <ul className="mt-6 space-y-2 text-[14px] text-ink">
        <li>✓ Fans charged</li>
        <li>✓ Printer invoice paid</li>
        <li>○ Printer confirms finished</li>
        <li>○ Payout to your bank</li>
      </ul>
      <p className="mt-6 text-[13px] text-ash">
        At the show, fans show a QR pickup code. The artist handover scanner is still being designed.
      </p>
    </TryScreen>
  );
}
