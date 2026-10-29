"use client";

import { TryScreen } from "@/components/try-chrome";
import { WaitlistForm } from "@/components/waitlist-form";
import { DEMO_END } from "@/lib/copy";

export default function TryDonePage() {
  return (
    <TryScreen step={7} title={DEMO_END.heading}>
      <p className="text-[15px] leading-relaxed text-ash">{DEMO_END.body}</p>
      <div className="mt-6">
        <WaitlistForm source="demo_end" showFeedback compact />
      </div>
    </TryScreen>
  );
}
