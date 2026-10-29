"use client";

import type { ReactNode } from "react";
import { cx } from "./ui";

/** Frameless square stage — no bezel, no notch. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("mx-auto w-full max-w-[440px] overflow-hidden rounded-[16px] border border-line bg-paper", className)}>
      <div className="aspect-square overflow-hidden bg-paper sm:aspect-[5/6]">{children}</div>
    </div>
  );
}