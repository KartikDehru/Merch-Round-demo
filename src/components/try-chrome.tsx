import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./ui";

export function TryScreen({
  step,
  total = 7,
  title,
  children,
  footer,
  className,
}: {
  step?: number;
  total?: number;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex min-h-[70dvh] flex-col border border-line bg-paper shadow-sm", className)}>
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <Link href="/" className="text-[12px] font-semibold text-ash hover:text-ink">
          Merch Round
        </Link>
        {step != null && (
          <span className="label text-[10px]">
            {step} / {total}
          </span>
        )}
      </header>
      <div className="flex-1 px-4 py-5">
        <h1 className="font-display text-[28px] leading-none sm:text-[32px]">{title}</h1>
        <div className="mt-5">{children}</div>
      </div>
      {footer && <div className="border-t border-line p-4">{footer}</div>}
    </div>
  );
}
