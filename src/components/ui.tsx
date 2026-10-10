"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { PledgeStatus, RoundStatus } from "@/lib/types";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "lime" | "danger";

const btnBase =
  "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.14em] text-[12px] transition-[transform,background,color,box-shadow] duration-150 active:translate-y-px disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-3 focus-visible:outline-lime focus-visible:outline-offset-2 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-coal border border-ink",
  secondary: "bg-card text-ink border border-ink/80 hover:bg-haze",
  ghost: "text-ash hover:text-ink",
  lime: "bg-lime text-ink border border-ink hover:shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-px",
  danger: "bg-card text-stop border border-stop/60 hover:bg-stop-soft",
};

const sizes = { sm: "h-8 px-3", md: "h-10 px-4", lg: "h-12 px-6 text-[13px]" };

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

export function Label({ children, className, slash = true }: { children: ReactNode; className?: string; slash?: boolean }) {
  return (
    <div className={cx("label", className)}>
      {slash && <span className="text-mute">{"// "}</span>}
      {children}
    </div>
  );
}

export function PixelNum({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("font-pixel text-2xl text-mute", className)}>{children}</span>;
}

export function Cell({ children, className, ...rest }: ComponentProps<"div">) {
  return (
    <div className={cx("scanlines border border-line", className)} {...rest}>
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
  return <h1 className={cx("font-display text-[40px] leading-[0.95] font-bold tracking-tight uppercase sm:text-[56px]", className)}>{children}</h1>;
}

export function H2({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cx("font-display text-[28px] leading-[1.05] font-bold tracking-tight sm:text-[36px]", className)}>{children}</h2>;
}

export function H3({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cx("font-display text-[20px] leading-tight font-bold tracking-tight sm:text-[24px]", className)}>{children}</h3>;
}

type Tone = "good" | "warn" | "bad" | "neutral" | "live" | "dark";

const toneCls: Record<Tone, string> = {
  good: "bg-go-soft text-go border-go/30",
  warn: "bg-hold-soft text-hold border-hold/30",
  bad: "bg-stop-soft text-stop border-stop/30",
  neutral: "bg-haze text-ash border-line",
  live: "bg-lime-soft text-ink border-lime",
  dark: "bg-ink text-paper border-ink",
};

export function Pill({ tone = "neutral", children, dot, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] whitespace-nowrap", toneCls[tone], className)}>
      {dot && <span className={cx("size-1.5 rounded-full", tone === "live" ? "animate-blink bg-go" : "bg-current")} />}
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
  pledged: { label: "Pledged", tone: "live" },
  withdrawn: { label: "Withdrawn", tone: "neutral" },
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

export function Stamp({ children, tone = "ink", rot = -4, className }: { children: ReactNode; tone?: "ink" | "go" | "stop" | "hold" | "lime"; rot?: number; className?: string }) {
  const c = {
    ink: "text-ink border-ink",
    go: "text-go border-go",
    stop: "text-stop border-stop",
    hold: "text-hold border-hold",
    lime: "text-ink border-ink bg-lime",
  }[tone];
  return (
    <span
      style={{ ["--stamp-rot" as string]: `${rot}deg` }}
      className={cx("animate-stamp inline-block border-[3px] px-3 py-1 font-display text-lg font-extrabold tracking-wide uppercase", c, className)}
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
      {hint && <span className="mt-1 block text-[12px] text-ash">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full h-11 border border-line bg-card px-3 text-[14px] text-ink placeholder:text-mute focus:border-ink focus:outline-none focus:ring-2 focus:ring-lime/60 transition";

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
    <div className={cx("inline-flex border border-ink/70 bg-card p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cx(
            "h-8 px-3 font-mono text-[11px] uppercase tracking-[0.16em] transition",
            value === o.value ? "bg-ink text-paper" : "text-ash hover:text-ink",
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
      <div className="mt-1 font-display text-[28px] leading-none font-bold tracking-tight tabular">{value}</div>
      {sub && <div className="mt-1 text-[12px] text-ash">{sub}</div>}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="dotgrid flex flex-col items-center justify-center border border-dashed border-line px-6 py-14 text-center">
      <div className="font-pixel text-xl text-mute">{title}</div>
      {children && <div className="mt-3 text-ash">{children}</div>}
    </div>
  );
}
