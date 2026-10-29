"use client";

import { TryScreen } from "@/components/try-chrome";
import { LinkButton } from "@/components/ui";
import { aud } from "@/lib/demo-math";
import { useTry } from "@/lib/try-store";

export default function TryHitPage() {
  const { state, math } = useTry();

  return (
    <TryScreen
      step={4}
      title="You hit the number"
      footer={
        <LinkButton href="/try/paid" variant="brick" size="lg" className="w-full">
          Approve the order
        </LinkButton>
      }
    >
      <p className="text-[15px] text-ash">
        Cards are charged on the close date. Check the order, then approve so we can pay the printer.
      </p>
      <dl className="mt-6 space-y-3 border border-line p-4 text-[14px]">
        <Row label="Printer" value="Inkhouse Wollongong" />
        <Row label="Quantity" value={`${state.target} tees`} />
        <Row label="Quote" value={aud(state.printerQuote)} />
        <Row label="Fans paid" value={aud(math.fansPay)} />
        <Row label="Your share (after print)" value={aud(math.artist)} />
      </dl>
      <p className="mt-4 text-[13px] text-ash">Sizes roll up from fan orders. In the real product you upload the printer invoice here.</p>
    </TryScreen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-line pb-2 last:border-0 last:pb-0">
      <dt className="text-ash">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
