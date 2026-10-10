"use client";

import type { Round } from "@/lib/types";
import { cx } from "./ui";

const STEPS: { key: Round["status"][]; label: string }[] = [
  { key: ["draft", "pending_review"], label: "Review" },
  { key: ["live"], label: "Live" },
  { key: ["charging", "awaiting_decision"], label: "Charging" },
  { key: ["confirmed"], label: "Confirmed" },
  { key: ["in_production"], label: "Printing" },
  { key: ["delivered"], label: "Delivered" },
  { key: ["paid_out"], label: "Paid out" },
  { key: ["completed"], label: "Done" },
];

export function Lifecycle({ round }: { round: Round }) {
  const dead = round.status === "failed" || round.status === "cancelled";
  let idx = STEPS.findIndex((s) => s.key.includes(round.status));
  if (dead) idx = round.status === "failed" ? 1 : round.chargeDeadline ? 2 : 1;
  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-[600px]">
        {STEPS.map((s, i) => {
          const done = i < idx;
          const here = i === idx;
          return (
            <li key={s.label} className="min-w-0 flex-1">
              <div className={cx("h-1.5", done ? "bg-ink" : here ? (dead ? "bg-stop" : "bg-lime") : "bg-line")} />
              <div className={cx("mt-2 pr-2 text-[10px] uppercase leading-tight tracking-[0.12em]", here ? (dead ? "text-stop" : "text-ink") : done ? "text-ash" : "text-mute")}>
                <span className="font-pixel block text-[12px]">{String(i + 1).padStart(2, "0")}</span>
                <span className="block truncate">{here && dead ? (round.status === "failed" ? "Missed" : "Cancelled") : s.label}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
