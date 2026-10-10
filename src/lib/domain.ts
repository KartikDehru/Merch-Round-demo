import type { Pledge, PledgeStatus, Round, RoundStatus } from "./types";

export const DAY = 86_400_000;
export const HOUR = 3_600_000;
export const FEE_RATE = 0.1;
export const CARD_RATE = 0.017;
export const CARD_FIXED = 0.3;
export const ROUND_DAYS = 14;

export const DEMO_FAN = { name: "Sam Taylor", email: "sam.taylor@demo.fan" };
export const ADMIN_EMAIL = "ops@merchround.com.au";

export function suggestTarget(printerQuote: number, minRun: number, price: number) {
  if (price <= 0) return minRun;
  return Math.max(minRun, Math.ceil((printerQuote * 1.3) / (price * (1 - FEE_RATE))));
}

export function latestSafeClose(showDate: number, leadWeeks: number) {
  return showDate - (leadWeeks + 2) * 7 * DAY;
}

export const COUNTED: PledgeStatus[] = [
  "pledged",
  "paid",
  "retry_scheduled",
  "action_required",
  "card_update_required",
  "fulfilled",
];
export const PAID: PledgeStatus[] = ["paid", "fulfilled"];
export const OWED: PledgeStatus[] = ["retry_scheduled", "action_required", "card_update_required"];

export function roundPledges(pledges: Pledge[], roundId: string) {
  return pledges.filter((p) => p.roundId === roundId);
}

export function counts(round: Round, pledges: Pledge[]) {
  const rp = roundPledges(pledges, round.id);
  const active = rp.filter((p) => COUNTED.includes(p.status));
  const paid = rp.filter((p) => PAID.includes(p.status));
  const owed = rp.filter((p) => OWED.includes(p.status));
  const refunded = rp.filter((p) => p.status === "refunded");
  const sizes: Record<string, number> = Object.fromEntries(round.sizes.map((s) => [s, 0]));
  const sizeSource = isPreClose(round) || !paid.length ? active : paid;
  for (const p of sizeSource) sizes[p.size] = (sizes[p.size] ?? 0) + 1;
  return {
    all: rp,
    active,
    paid,
    owed,
    refunded,
    pledgedCount: active.length,
    paidCount: paid.length,
    sizes,
    handedOver: paid.filter((p) => p.handedOverAt || p.shippedAt).length,
  };
}

export function money(round: Round, pledges: Pledge[]) {
  const c = counts(round, pledges);
  const pledgedGross = c.active.reduce((s, p) => s + p.amount, 0);
  const paidGross = c.paid.reduce((s, p) => s + p.amount, 0);
  const refundedGross = c.refunded.reduce((s, p) => s + p.amount, 0);
  const pre = isPreClose(round);
  const basis = pre ? pledgedGross : paidGross;
  const fee = round2(basis * FEE_RATE);
  const cardFees = pre
    ? round2(c.pledgedCount * CARD_FIXED + pledgedGross * CARD_RATE)
    : round2((c.paidCount + c.refunded.length) * CARD_FIXED + (paidGross + refundedGross) * CARD_RATE);
  const printer = round.printer.invoiceAmount ?? round.printerQuote;
  const covered = round.decision === "cover" ? round.shortfall ?? 0 : 0;
  const artist = round2(Math.max(0, basis - fee - printer + covered));
  return {
    pledgedGross,
    paidGross,
    refundedGross,
    basis,
    fee,
    cardFees,
    platformNet: round2(fee - cardFees),
    printer,
    covered,
    artist,
  };
}

export function projectedAtTarget(round: Round) {
  const gross = round.target * round.price;
  const fee = round2(gross * FEE_RATE);
  return { gross, fee, printer: round.printerQuote, artist: round2(gross - fee - round.printerQuote) };
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export const ROUND_FLOW: RoundStatus[] = [
  "live",
  "charging",
  "confirmed",
  "in_production",
  "delivered",
  "paid_out",
  "completed",
];

export function isOpen(r: Round) {
  return r.status === "live";
}

export function isPreClose(r: Round) {
  return r.status === "live" || r.status === "draft" || r.status === "pending_review";
}

export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
