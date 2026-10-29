"use client";

import { TryScreen } from "@/components/try-chrome";
import { LinkButton } from "@/components/ui";

export default function TryStartPage() {
  return (
    <TryScreen
      step={1}
      title="Start your first round"
      footer={
        <LinkButton href="/try/setup" variant="brick" size="lg" className="w-full">
          Start
        </LinkButton>
      }
    >
      <p className="text-[15px] leading-relaxed text-ash">
        This is a preview. Nothing is real money. You&apos;ll upload a design, set your numbers, share a link, then see what happens if the round hits — or misses.
      </p>
      <ul className="mt-6 space-y-3 text-[14px] text-ink">
        <li className="border-b border-line pb-3">1. Add your design and description</li>
        <li className="border-b border-line pb-3">2. Set price, fans needed, and printer quote</li>
        <li className="border-b border-line pb-3">3. Pick how long the round runs</li>
        <li>4. Share the link and watch it fill</li>
      </ul>
      <p className="mt-6 text-[13px] text-ash">
        Curious what fans see?{" "}
        <a href="/try/fan" className="font-semibold text-ink underline underline-offset-2">
          Open the fan walkthrough
        </a>
        .
      </p>
    </TryScreen>
  );
}
