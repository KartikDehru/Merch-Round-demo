"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { PledgeStatus, RoundStatus } from "@/lib/types";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "brick" | "danger";

const btnBase =
  "inline-flex items-center justify-center gap-2 font-bold transition-[transform,background,color] duration-150 active:translate-y-px disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-3 focus-visible:outline-ink focus-visible:outline-offset-2 select-none rounded-[4px]";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-coal border border-ink",
  secondary: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
  ghost: "text-ash hover:text-ink hover:underline",
  brick: "bg-brick text-ink border border-brick hover:bg-brick-deep hover:border-brick-deep",
  danger: "bg-transparent text-stop border border-stop hover:bg-stop-soft",
};

const sizes = { sm: "h-9 px-3 text-[13px]", md: "h-11 px-5 text-[15px]", lg: "h-14 px-8 text-[16px]" };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <button className={cx(btnBase, variants[variant], sizes[size], className)} {...rest} />;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <Link className={cx(btnBase, variants[variant], sizes[size], className)} {...rest} />;
}

export function Label({ children, className }: { children: ReactNode; className?: string; slash?: boolean }) {
  return <div className={cx("label", className)}>{children}</div>;
}

export function PixelNum({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("font-display text-[28px] leading-none text-ink", className)}>{children}</span>;
}

export function Cell({ children, className, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cx("border border-line bg-card", className)} {...rest}>
      {children}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx("border border-line bg-card", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <Label>{title}</Label>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function H1({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cx("font-display text-[48px] leading-[0.95] sm:text-[72px]", className)}>{children}</h1>;
}

export function H2({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cx("font-display text-[34px] leading-none sm:text-[48px]", className)}>{children}</h2>;
}

export function H3({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cx("font-display text-[22px] leading-[1.05] sm:text-[26px]", className)}>{children}</h3>;
}

type Tone = "good" | "warn" | "bad" | "neutral" | "live" | "dark";

const toneCls: Record<Tone, string> = {
  good: "bg-go-soft text-go border-transparent",
  warn: "bg-hold-soft text-hold border-transparent",
  bad: "bg-stop-soft text-stop border-transparent",
  neutral: "bg-haze text-ash border-transparent",
  live: "bg-brick text-ink border-transparent",
  dark: "bg-ink text-paper border-transparent",
};

export function Pill({ tone = "neutral", children, dot, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] whitespace-nowrap", toneCls[tone], className)}>
      {dot && <span className={cx("size-1.5 rounded-full bg-current", tone === "live" && "animate-blink")} />}
      {children}
    </span>
  );
}

export const ROUND_META: Record<RoundStatus, { label: string; tone: Tone; fan: string }> = {
  draft: { label: "Draft", tone: "neutral", fan: "Draft" },
  pending_review: { label: "In review", tone: "warn", fan: "Coming soon" },
  live: { label: "Live", tone: "live", fan: "Open" },
  charging: { label: "Charging", tone: "warn", fan: "Closed · charging" },
  awaiting_decision: { label: "Decision needed", tone: "warn", fan: "Closed · confirming" },
  confirmed: { label: "Confirmed", tone: "good", fan: "It's happening" },
  in_production: { label: "Printing", tone: "good", fan: "Being printed" },
  delivered: { label: "Delivered", tone: "good", fan: "Ready soon" },
  paid_out: { label: "Paid out", tone: "good", fan: "Ready at the show" },
  completed: { label: "Completed", tone: "dark", fan: "Done" },
  failed: { label: "Missed target", tone: "bad", fan: "Not this time" },
  cancelled: { label: "Cancelled", tone: "bad", fan: "Cancelled" },
};

export const PLEDGE_META: Record<PledgeStatus, { label: string; tone: Tone }> = {
  pledged: { label: "Asked for", tone: "live" },
  withdrawn: { label: "Cancelled", tone: "neutral" },
  released: { label: "Released · not charged", tone: "neutral" },
  paid: { label: "Paid", tone: "good" },
  retry_scheduled: { label: "Retrying", tone: "warn" },
  action_required: { label: "Needs 3-D Secure", tone: "warn" },
  card_update_required: { label: "Card declined", tone: "bad" },
  unpaid: { label: "Lapsed", tone: "bad" },
  refunded: { label: "Refunded", tone: "neutral" },
  fulfilled: { label: "Collected", tone: "dark" },
};

export function RoundPill({ status, fan }: { status: RoundStatus; fan?: boolean }) {
  const m = ROUND_META[status];
  return (
    <Pill tone={m.tone} dot={status === "live"}>
      {fan ? m.fan : m.label}
    </Pill>
  );
}

export function PledgePill({ status }: { status: PledgeStatus }) {
  const m = PLEDGE_META[status];
  return <Pill tone={m.tone}>{m.label}</Pill>;
}

export function Stamp({ children, tone = "ink", rot = -4, className }: { children: ReactNode; tone?: "ink" | "go" | "stop" | "hold" | "brick"; rot?: number; className?: string }) {
  const c = {
    ink: "text-ink border-ink",
    go: "text-teal border-teal bg-paper",
    stop: "text-stop border-stop bg-paper",
    hold: "text-hold border-hold bg-paper",
    brick: "text-ink border-brick bg-brick",
  }[tone];
  return (
    <span
      style={{ ["--stamp-rot" as string]: `${rot}deg` }}
      className={cx("animate-stamp inline-block border-2 px-3 py-1 font-display text-[22px] leading-tight", c, className)}
    >
      {children}
    </span>
  );
}

export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cx("block", className)}>
      <span className="label mb-1.5 block">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[13px] text-ash">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full h-12 rounded-[4px] border border-line bg-card px-3 text-[16px] text-ink placeholder:text-mute focus:border-ink focus:outline-none transition";

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cx(inputCls, props.className)} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={cx(inputCls, "h-auto min-h-24 py-2", props.className)} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cx(inputCls, "appearance-none", props.className)} />;
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cx("inline-flex items-center gap-5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            "h-9 text-[14px] font-semibold transition border-b-2",
            value === o.value ? "border-brick text-ink" : "border-transparent text-ash hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stat({ label, value, sub, className }: { label: string; value: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={cx("min-w-0", className)}>
      <div className="label">{label}</div>
      <div className="mt-2 font-display text-[34px] leading-none tabular">{value}</div>
      {sub && <div className="mt-1.5 text-[13px] text-ash">{sub}</div>}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-ink/20 px-6 py-14 text-center">
      <div className="font-display text-[26px] text-ash">{title}</div>
      {children && <div className="mt-3 text-ash">{children}</div>}
    </div>
  );
}
