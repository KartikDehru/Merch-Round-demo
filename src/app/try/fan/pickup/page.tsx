"use client";

import { QRCodeSVG } from "qrcode.react";
import { TryScreen } from "@/components/try-chrome";
import { LinkButton } from "@/components/ui";

const CODE = "MR4821";
const URL = `https://merchround.com/pickup/${CODE}`;

export default function FanPickupPage() {
  return (
    <TryScreen
      step={5}
      total={6}
      title="Pickup code"
      footer={
        <LinkButton href="/try/done" variant="secondary" size="lg" className="w-full">
          Back to end of demo
        </LinkButton>
      }
    >
      <p className="text-[14px] text-ash">Show this at the merch desk. Each order has its own code. A code can only be used once.</p>
      <div className="mt-6 flex flex-col items-center border border-line bg-paper p-6">
        <QRCodeSVG value={URL} size={180} level="M" includeMargin={false} />
        <p className="mt-4 font-mono text-[22px] font-bold tracking-[0.2em]">{CODE.replace("MR", "MR ")}</p>
        <p className="mt-1 text-[12px] text-ash">Backup if the scan fails</p>
      </div>
      <p className="mt-4 text-center text-[12px] text-mute">{URL}</p>
    </TryScreen>
  );
}
