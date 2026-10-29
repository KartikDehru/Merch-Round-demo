"use client";

import type { ReactNode } from "react";
import { cx } from "./ui";

/** Device chrome sized like the Figma mobile frames (388 × 580). */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "relative mx-auto w-full max-w-[280px] overflow-hidden rounded-[32px] border border-line bg-ink p-[10px] shadow-[0_20px_48px_rgba(1,1,0,0.14)]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-[18px] z-10 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-ink" />
      <div className="aspect-[388/580] overflow-hidden rounded-[24px] bg-paper">{children}</div>
    </div>
  );
}
