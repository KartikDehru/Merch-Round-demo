"use client";

import Image from "next/image";
import { useState } from "react";
import { TryScreen } from "@/components/try-chrome";
import { LinkButton, Pill, cx } from "@/components/ui";
import { SHOW_ROUND } from "@/lib/copy";

const SIZES = ["S", "M", "L", "XL"] as const;

export default function FanRoundPage() {
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const pct = Math.round((SHOW_ROUND.progress / SHOW_ROUND.target) * 100);

  return (
    <TryScreen
      step={1}
      total={6}
      title={SHOW_ROUND.title}
      footer={
        <LinkButton href="/try/fan/card" variant="brick" size="lg" className="w-full">
          Save your card · {SHOW_ROUND.price}
        </LinkButton>
      }
    >
      <div className="relative aspect-square overflow-hidden border border-line bg-stone">
        <Image src="/merch/tee.jpg" alt="" fill className="object-cover" sizes="400px" />
        <div className="absolute left-3 top-3">
          <Pill tone="live" dot>
            Open
          </Pill>
        </div>
      </div>
      <p className="mt-3 text-[14px] text-ash">Merch Round Tee · {SHOW_ROUND.price}</p>
      <div className="mt-4">
        <div className="flex justify-between text-[13px] font-semibold">
          <span>
            {SHOW_ROUND.progress} / {SHOW_ROUND.target}
          </span>
          <span className="text-ash">{SHOW_ROUND.timeLeft}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-brick" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-5">
        <div className="label mb-2">Size</div>
        <div className="flex gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cx(
                "size-10 rounded-[4px] border text-[13px] font-bold",
                size === s ? "border-ink bg-ink text-paper" : "border-line",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="label mb-2">Fulfilment</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMethod("pickup")}
            className={cx(
              "rounded-[4px] border px-3 py-2 text-left text-[13px] font-semibold",
              method === "pickup" ? "border-ink bg-brick" : "border-line",
            )}
          >
            Pickup at the show
          </button>
          <button
            type="button"
            onClick={() => setMethod("delivery")}
            className={cx(
              "rounded-[4px] border px-3 py-2 text-left text-[13px] font-semibold",
              method === "delivery" ? "border-ink bg-brick" : "border-line",
            )}
          >
            Delivery · A$12.50
          </button>
        </div>
      </div>
    </TryScreen>
  );
}
