"use client";

import type { ReactNode } from "react";
import { cx } from "./ui";

export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "relative mx-auto w-full max-w-[280px] overflow-hidden rounded-[28px] border-[3px] border-ink bg-paper shadow-[0_18px_40px_rgba(1,1,0,0.12)]",
        className,
      )}
    >
      <div className="flex justify-center bg-ink py-2">
        <div className="h-1.5 w-16 rounded-full bg-paper/30" />
      </div>
      <div className="aspect-[9/16] overflow-hidden bg-stone">{children}</div>
    </div>
  );
}
