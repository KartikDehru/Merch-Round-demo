"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import type { ReactNode } from "react";
import { useWorld } from "@/lib/store";
import { counts } from "@/lib/domain";
import { aud, date } from "@/lib/format";
import type { Artist, Pledge, Round } from "@/lib/types";
import * as A from "@/lib/actions";
import { Countdown, MerchMock, Tally } from "./visuals";
import { Button, Label, RoundPill, Stamp, cx } from "./ui";

export function useRound(id: string) {
  const { world } = useWorld();
  const round = world.rounds.find((r) => r.id === id || r.slug === id);
  const artist = round ? world.artists.find((a) => a.id === round.artistId) : undefined;
  return { round, artist, c: round ? counts(round, world.pledges) : undefined };
}

/* ───────── Round card ───────── */

export function RoundCard({ round, artist, href, index }: { round: Round; artist: Artist; href: string; index?: number }) {
  const { world, now } = useWorld();
  const c = counts(round, world.pledges);
  const shown = round.status === "live" ? c.pledgedCount : c.paidCount || c.pledgedCount;
  return (
    <Link href={href} className="group block transition duration-300 hover:-translate-y-0.5">
      <div className="label mb-2 flex items-center justify-between">
        <span>{index !== undefined ? `Round ${String(index + 1).padStart(2, "0")}` : artist.name}</span>
      </div>
      <div className="relative aspect-square overflow-hidden bg-stone">
        {round.status === "live" && (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-brick px-2.5 py-0.5 text-[11px] font-bold tracking-[0.08em] text-ink uppercase">
            <span className="size-1.5 animate-blink rounded-full bg-ink" />
            Open
          </span>
        )}
        {round.status !== "live" && (
          <span className="absolute top-3 left-3 z-10">
            <RoundPill status={round.status} fan />
          </span>
        )}
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
          <MerchMock
            product={round.product}
            colorway={round.colorway}
            motif={round.motif}
            accent={round.colorway === "bone" ? "#111111" : "#ffffff"}
            label={artist.name}
            fit="cover"
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="label !text-mute">{artist.name}</div>
        <div className="mt-1 text-[17px] font-bold leading-tight">{round.title}</div>
        <div className="mt-0.5 text-[15px] text-ash">{aud(round.price)}</div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-[13px] tabular">
          <span>
            <b>{shown} asked for</b>
          </span>
          <span className="text-ash">{round.target} needed</span>
        </div>
        <Tally pledged={shown} target={round.target} size="sm" className="mt-2" />
        <div className="mt-2.5 flex items-center justify-between text-[13px] text-ash">
          {round.status === "live" ? (
            <span>
              Closes in <Countdown to={round.closesAt} now={now} className="text-[13px]" />
            </span>
          ) : (
            <span>
              {date(round.showDate)} · {round.venue.split(",")[0]}
            </span>
          )}
          <span className="font-semibold text-ink underline underline-offset-2">View round</span>
        </div>
      </div>
    </Link>
  );
}

/* ───────── Receipt ───────── */

export function Receipt({ rows, total, className }: { rows: { label: ReactNode; value: ReactNode; muted?: boolean }[]; total?: { label: ReactNode; value: ReactNode }; className?: string }) {
  return (
    <div className={cx("text-[15px]", className)}>
      {rows.map((r, i) => (
        <div key={i} className={cx("flex items-baseline gap-2 py-1", r.muted && "opacity-60")}>
          <span className="shrink-0">{r.label}</span>
          <span className="mb-1 flex-1 border-b border-dotted border-current opacity-30" />
          <span className="shrink-0 tabular">{r.value}</span>
        </div>
      ))}
      {total && (
        <div className="mt-2 flex items-baseline gap-2 border-t-[3px] border-current pt-2">
          <span className="font-display text-[18px]">{total.label}</span>
          <span className="flex-1" />
          <span className="font-display text-[28px] tabular">{total.value}</span>
        </div>
      )}
    </div>
  );
}

/* ───────── Fan status timeline ───────── */

export function FanTimeline({ round, pledge }: { round: Round; pledge: Pledge }) {
  const failed = round.status === "failed" || round.status === "cancelled" || ["withdrawn", "released", "unpaid", "refunded"].includes(pledge.status);
  const paid = ["paid", "fulfilled"].includes(pledge.status) || (pledge.status === "refunded" && !!pledge.paidAt);
  const printing = ["in_production", "delivered", "paid_out", "completed"].includes(round.status);
  const ready = ["paid_out", "completed"].includes(round.status) || round.status === "delivered";
  const done = pledge.status === "fulfilled";
  const reached = !!round.reachedAt || !["live", "draft", "pending_review"].includes(round.status);

  const steps = [
    { label: "Bought · card saved", sub: date(pledge.createdAt), on: true },
    { label: `Round hits ${round.target}`, sub: reached ? "Reached" : `Closes ${date(round.closesAt)}`, on: reached && round.status !== "failed" },
    { label: `Charged ${aud(pledge.amount)}`, sub: paid ? date(pledge.paidAt ?? round.closesAt) : pledge.status === "action_required" ? "Needs your OK" : pledge.status === "card_update_required" ? "Card declined" : "Only if it hits", on: paid, warn: ["action_required", "card_update_required", "retry_scheduled"].includes(pledge.status) },
    { label: "Printing", sub: printing ? `Ready ${date(round.printer.expectedReadyAt ?? round.showDate)}` : `${round.printer.name}`, on: printing && paid },
    {
      label: pledge.fulfilment === "pickup" ? `Ready at ${round.venue.split(",")[0]}` : "Posted to you",
      sub: pledge.fulfilment === "pickup" ? date(round.showDate) : pledge.shippedAt ? date(pledge.shippedAt) : "After printing",
      on: ready && paid,
    },
    { label: pledge.fulfilment === "pickup" ? "Collected" : "Delivered", sub: done && (pledge.handedOverAt || pledge.shippedAt) ? date((pledge.handedOverAt ?? pledge.shippedAt)!) : "", on: done },
  ];

  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
          {i < steps.length - 1 && <span className={cx("absolute top-6 bottom-0 left-[11px] w-[3px]", s.on && steps[i + 1].on ? "bg-ink" : "bg-line")} />}
          <span
            className={cx(
              "relative flex size-6 shrink-0 items-center justify-center rounded-full border-[3px] text-[11px] font-bold",
              s.on ? "border-ink bg-ink text-paper" : s.warn ? "border-hold bg-hold-soft text-hold" : failed ? "border-line bg-haze" : "border-ink/25 bg-paper",
            )}
          >
            {s.on ? "✓" : s.warn ? "!" : ""}
          </span>
          <div>
            <div className={cx("text-[17px] leading-tight font-bold", !s.on && "text-ash")}>{s.label}</div>
            {s.sub && <div className="text-[14px] text-ash">{s.sub}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ───────── Ticket ───────── */

export function Ticket({ round, artist, pledge }: { round: Round; artist: Artist; pledge: Pledge }) {
  const active = ["paid", "fulfilled"].includes(pledge.status);
  const dead = ["withdrawn", "released", "unpaid", "refunded"].includes(pledge.status);
  return (
    <div className="relative">
      <div className="relative flex -rotate-1 bg-ink text-paper">
        <div className="w-3 shrink-0" style={{ background: artist.accent }} />
        <div className="min-w-0 flex-1 p-5 sm:p-6">
          <div className="text-[12px] tracking-[0.14em] text-fog uppercase">{pledge.fulfilment === "pickup" ? "Show pick-up ticket" : "Delivery order"}</div>
          <div className="mt-2 font-display text-[34px] leading-none">{artist.name}</div>
          <div className="mt-1 text-[16px] text-fog">
            {round.title} · <b className="text-paper">{pledge.size}</b>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-[14px]">
            <div>
              <div className="text-[11px] tracking-[0.14em] text-fog uppercase">Name</div>
              <div className="mt-0.5 truncate">{pledge.name}</div>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.14em] text-fog uppercase">Code</div>
              <div className="mt-0.5 font-display text-[20px] leading-tight text-brick-light">{pledge.code}</div>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.14em] text-fog uppercase">{pledge.fulfilment === "pickup" ? "Where" : "To"}</div>
              <div className="mt-0.5 truncate">{pledge.fulfilment === "pickup" ? round.venue : pledge.address}</div>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.14em] text-fog uppercase">When</div>
              <div className="mt-0.5">{date(round.showDate, true)}</div>
            </div>
          </div>
        </div>
        <div className="relative flex w-[132px] shrink-0 flex-col items-center justify-center border-l-2 border-dashed border-paper/60 p-3 sm:w-[160px]">
          <span className="absolute -top-3 -left-[13px] size-6 rounded-full bg-paper" />
          <span className="absolute -bottom-3 -left-[13px] size-6 rounded-full bg-paper" />
          <div className={cx("bg-paper p-2 transition", !active && "opacity-25 blur-[1.5px]")}>
            <QRCodeSVG value={`merchround:${pledge.code}:${pledge.id}`} size={96} level="M" fgColor="#15181C" bgColor="#F3EFE6" />
          </div>
          <div className="mt-2 text-center text-[11px] tracking-[0.12em] text-fog uppercase">
            {active ? "show at the desk" : dead ? "not valid" : "unlocks when paid"}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-4 right-28 sm:right-36">
        {pledge.status === "fulfilled" && <Stamp tone="ink" rot={-8}>Collected</Stamp>}
        {pledge.status === "paid" && <Stamp tone="go" rot={-6}>Paid</Stamp>}
        {pledge.status === "pledged" && <Stamp tone="brick" rot={-5}>Asked for</Stamp>}
        {pledge.status === "action_required" && <Stamp tone="hold" rot={-5}>Action needed</Stamp>}
        {pledge.status === "card_update_required" && <Stamp tone="stop" rot={-5}>Card declined</Stamp>}
        {pledge.status === "retry_scheduled" && <Stamp tone="hold" rot={-5}>Retrying</Stamp>}
        {pledge.status === "released" && <Stamp tone="ink" rot={-5}>Not charged</Stamp>}
        {pledge.status === "refunded" && <Stamp tone="ink" rot={-5}>Refunded</Stamp>}
        {pledge.status === "unpaid" && <Stamp tone="stop" rot={-5}>Lapsed</Stamp>}
        {pledge.status === "withdrawn" && <Stamp tone="ink" rot={-5}>Cancelled</Stamp>}
      </div>
    </div>
  );
}

/* ───────── Demo controls (time travel) ───────── */

export function DemoControls({ round, compact = false }: { round: Round; compact?: boolean }) {
  const { act, toast, world } = useWorld();
  const c = counts(round, world.pledges);
  const steps: { label: string; hint: string; run: () => void; tone?: "brick" | "secondary" | "danger" }[] = [];

  const go = (fn: (w: typeof world) => void, msg: string, tone: "good" | "warn" | "bad" | "neutral" = "good") => () => {
    act(fn);
    toast(msg, tone);
  };

  switch (round.status) {
    case "pending_review":
      steps.push({ label: "Admin approves", hint: "Publishes the round", run: go(A.approveRound(round.id), "Round approved and live"), tone: "brick" });
      break;
    case "live":
      steps.push({ label: "+5 fans buy", hint: "Simulate traffic from Instagram", run: go(A.simAddPledges(round.id, 5), "5 more fans bought"), tone: "secondary" });
      if (c.pledgedCount < round.target)
        steps.push({ label: `Fill to ${round.target}`, hint: "Get it over the line", run: go(A.simAddPledges(round.id, round.target - c.pledgedCount), `Reached ${round.target}`), tone: "secondary" });
      steps.push({
        label: "Jump to close date",
        hint: c.pledgedCount >= round.target ? "Closes and charges saved cards" : "Closes below target: nobody charged",
        run: go(A.simClose(round.id), c.pledgedCount >= round.target ? "Closed. Charging cards." : "Closed below target. Nobody charged.", c.pledgedCount >= round.target ? "good" : "bad"),
        tone: "brick",
      });
      break;
    case "charging":
      steps.push({ label: "+24h: retry soft declines", hint: "Stripe retries insufficient funds etc.", run: go(A.simRetry(round.id), "Retried declined cards"), tone: "secondary" });
      steps.push({ label: "Some fans fix payment", hint: "Half complete 3-D Secure or add a card", run: go(A.simFansAct(round.id), "Fans updated payments"), tone: "secondary" });
      steps.push({ label: "Jump +72h: end window", hint: "Lapses unpaid, confirms or asks artist", run: go(A.simEndWindow(round.id), "Charge window closed"), tone: "brick" });
      break;
    case "awaiting_decision":
      steps.push({ label: "Let 48h pass", hint: "No decision = cancel + refund", run: go(A.simExpireDecision(round.id), "Decision expired. Round cancelled.", "bad"), tone: "danger" });
      break;
    case "confirmed":
      steps.push({ label: "Admin sends printer order", hint: "Size breakdown goes to printer", run: go(A.sendPrinterOrder(round.id), "Order sent to printer"), tone: "brick" });
      break;
    case "in_production":
      steps.push({ label: "Jump: printer delivers", hint: "Invoice paid, merch at artist", run: go(A.printerDelivered(round.id), "Merch delivered to artist"), tone: "brick" });
      break;
    case "delivered":
      steps.push({ label: "Artist confirms + gets paid", hint: "Stripe transfer to artist", run: go(A.confirmDelivery(round.id), "Artist paid out"), tone: "brick" });
      break;
    case "paid_out":
      steps.push({ label: "Jump to show night", hint: "Hand over everyone except Sam", run: go(A.simShowNight(round.id), "Show night done"), tone: "brick" });
      break;
  }

  if (!steps.length) return null;

  return (
    <div className={cx("relative border-2 border-dashed border-ink/40 bg-stone", compact ? "p-3" : "p-4")}>
      <div className="flex items-center justify-between gap-3">
        <Label>Demo controls · time travel</Label>
        <RoundPill status={round.status} />
      </div>
      <div className={cx("mt-3 grid gap-2", !compact && "sm:grid-cols-2")}>
        {steps.map((s) => (
          <Button key={s.label} variant={s.tone ?? "secondary"} onClick={s.run} className="h-auto flex-col items-start gap-0.5 py-2.5 text-left">
            <span className="text-[15px]">{s.label}</span>
            <span className="text-[12px] font-normal opacity-75">{s.hint}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

/* ───────── Round hero numbers ───────── */

export function ProgressBlock({ round, big = false, dark = false }: { round: Round; artist?: Artist; big?: boolean; dark?: boolean }) {
  const { world, now } = useWorld();
  const c = counts(round, world.pledges);
  const pre = round.status === "live";
  const shown = pre ? c.pledgedCount : c.paidCount;
  return (
    <div>
      <div className={cx("flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-bold tabular", big ? "text-[20px]" : "text-[17px]")}>
        <span>
          {shown} {pre ? "asked for" : "paid"}
        </span>
        <span className={cx("font-medium", dark ? "text-fog" : "text-ash")}>{round.target} needed</span>
      </div>
      <Tally
        pledged={pre ? c.pledgedCount : c.paidCount + c.owed.length}
        paid={pre ? 0 : c.paidCount}
        target={round.target}
        dark={dark}
        className="mt-3"
      />
      {pre && (
        <div className={cx("mt-3 text-[15px]", dark ? "text-fog" : "text-ash")}>
          Closes in <Countdown to={round.closesAt} now={now} className={cx("text-[15px]", dark && "!text-paper")} />
        </div>
      )}
      <div className={cx("mt-1 text-[15px] leading-snug", dark ? "text-cloud" : "text-ash")}>
        {pre
          ? c.pledgedCount >= round.target
            ? `Target reached. Still open until ${date(round.closesAt)}.`
            : `${round.target - c.pledgedCount} more and it gets made.`
          : round.status === "charging"
            ? `${c.paidCount} paid · ${c.owed.length} being retried`
            : `${c.paidCount} paid orders`}
      </div>
    </div>
  );
}

/* ───────── Size bars ───────── */

export function SizeBars({ sizes }: { sizes: Record<string, number>; accent?: string }) {
  const max = Math.max(1, ...Object.values(sizes));
  return (
    <div className="space-y-2">
      {Object.entries(sizes).map(([s, n]) => (
        <div key={s} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-[15px] font-bold">{s}</span>
          <div className="h-5 flex-1 bg-ink/10">
            <div className="h-full bg-brick transition-all" style={{ width: `${(n / max) * 100}%` }} />
          </div>
          <span className="w-8 text-right tabular">{n}</span>
        </div>
      ))}
    </div>
  );
}
