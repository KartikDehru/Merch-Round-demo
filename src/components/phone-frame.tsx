"use client";

import type { ReactNode } from "react";
import { cx } from "./ui";

/** Frameless Figma artboard (388 × 580). No bezel, no notch. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("mx-auto w-full max-w-[480px] overflow-hidden rounded-[16px] border border-line bg-paper", className)}>
      <div className="aspect-[388/580] overflow-hidden bg-paper">{children}</div>
    </div>
  );
}