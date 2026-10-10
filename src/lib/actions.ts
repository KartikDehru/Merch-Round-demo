import { ADMIN_EMAIL, DAY, FEE_RATE, HOUR, OWED, counts, hash, money, round2 } from "./domain";
import { aud, date, dateTime } from "./format";
import { makeCode } from "./seed";
import type { Actor, Email, Issue, LogEvent, Pledge, Role, Round, World } from "./types";

let counter = 0;
export function uid(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

function find(w: World, roundId: string) {
  const r = w.rounds.find((x) => x.id === roundId);
  if (!r) throw new Error(`Round ${roundId} not found`);
  return r;
}

function artistOf(w: World, r: Round) {
  return w.artists.find((a) => a.id === r.artistId)!;
}

export function artistEmail(w: World, artistId: string) {
  const a = w.artists.find((x) => x.id === artistId)!;
  return `${a.slug.replace(/-/g, "")}@demo.band`;
}

function log(w: World, actor: Actor, text: string, roundId?: string, tone?: LogEvent["tone"], pledgeId?: string) {
  w.events.unshift({ id: uid("e"), at: Date.now(), actor, text, roundId, pledgeId, tone });
}

function mail(
  w: World,
  to: string,
  audience: Role,
  subject: string,
  body: string,
  roundId?: string,
  pledgeId?: string,
) {
  const e: Email = { id: uid("m"), at: Date.now(), to, audience, subject, body, roundId, pledgeId, read: false };
  w.emails.unshift(e);
}

function mailArtist(w: World, r: Round, subject: string, body: string) {
  mail(w, artistEmail(w, r.artistId), "artist", subject, body, r.id);
}

function mailAdmin(w: World, subject: string, body: string, roundId?: string) {
  mail(w, ADMIN_EMAIL, "admin", subject, body, roundId);
}

function mailFan(w: World, p: Pledge, subject: string, body: string) {
  mail(w, p.email, "fan", subject, body, p.roundId, p.id);
}

/* ───────────────────────── session ───────────────────────── */

export const login = (role: Role | null, artistId?: string) => (w: World) => {
  w.session.role = role;
  if (artistId) w.session.artistId = artistId;
};

export const markRead = (ids: string[]) => (w: World) => {
  for (const e of w.emails) if (ids.includes(e.id)) e.read = true;
};

/* ───────────────────────── fan ───────────────────────── */

export interface PledgeInput {
  id: string;
  name: string;
  email: string;
  size: string;
  fulfilment: "pickup" | "delivery";
  address?: string;
  last4: string;
  brand: Pledge["card"]["brand"];
}

export const createPledge = (roundId: string, input: PledgeInput) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "live") return;
  const before = counts(r, w.pledges).pledgedCount;
  const amount = r.price + (input.fulfilment === "delivery" ? r.deliveryFee : 0);
  const p: Pledge = {
    id: input.id,
    code: makeCode(input.id),
    roundId,
    name: input.name,
    email: input.email,
    size: input.size,
    fulfilment: input.fulfilment,
    address: input.address,
    amount,
    card: { brand: input.brand, last4: input.last4 },
    status: "pledged",
    attempts: 0,
    createdAt: Date.now(),
  };
  w.pledges.push(p);
  log(w, "fan", `${p.name} pledged (${p.size}, ${p.fulfilment})`, r.id, "neutral", p.id);
  log(w, "stripe", `SetupIntent succeeded · card •••• ${p.card.last4} saved for later`, r.id, "money", p.id);
  mailFan(
    w,
    p,
    "You're in. Nothing charged yet.",
    `You pledged for ${r.title} (${p.size}) from ${artistOf(w, r).name}. You'll only be charged ${aud(amount)} on ${date(r.closesAt, true)} if the round reaches ${r.target}. If it doesn't, nothing is charged.`,
  );
  if (before < r.target && before + 1 >= r.target) {
    r.reachedAt = Date.now();
    log(w, "system", `Reached target of ${r.target}`, r.id, "good");
    mailArtist(w, r, `You hit ${r.target}: ${r.title} is happening`, `Your round reached its number. It stays open until ${date(r.closesAt)} so more fans can get in.`);
  }
};

export const withdrawPledge = (pledgeId: string) => (w: World) => {
  const p = w.pledges.find((x) => x.id === pledgeId);
  if (!p || p.status !== "pledged") return;
  const r = find(w, p.roundId);
  if (r.status !== "live") return;
  p.status = "withdrawn";
  log(w, "fan", `${p.name} cancelled their pledge`, r.id, "neutral", p.id);
  mailFan(w, p, "Pledge cancelled", `Your pledge for ${r.title} is cancelled. Your saved card was removed. Nothing was charged.`);
};

export const confirmAuth = (pledgeId: string) => (w: World) => {
  const p = w.pledges.find((x) => x.id === pledgeId);
  if (!p || p.status !== "action_required") return;
  const r = find(w, p.roundId);
  p.status = "paid";
  p.paidAt = Date.now();
  p.declineReason = undefined;
  log(w, "fan", `${p.name} completed 3-D Secure`, r.id, "neutral", p.id);
  log(w, "stripe", `payment_intent.succeeded · ${aud(p.amount)}`, r.id, "money", p.id);
  mailFan(w, p, `Paid: ${aud(p.amount)} for ${r.title}`, `Thanks. Your payment went through. We'll let you know when it's being printed.`);
};

export const updateCard = (pledgeId: string, last4: string) => (w: World) => {
  const p = w.pledges.find((x) => x.id === pledgeId);
  if (!p) return;
  const r = find(w, p.roundId);
  p.card = { brand: "Visa", last4 };
  if (p.status === "pledged") {
    log(w, "fan", `${p.name} updated their card`, r.id, "neutral", p.id);
    return;
  }
  if (p.status === "card_update_required" || p.status === "retry_scheduled") {
    p.attempts += 1;
    p.status = "paid";
    p.paidAt = Date.now();
    p.declineReason = undefined;
    log(w, "fan", `${p.name} added a new card`, r.id, "neutral", p.id);
    log(w, "stripe", `payment_intent.succeeded · ${aud(p.amount)} on new card`, r.id, "money", p.id);
    mailFan(w, p, `Paid: ${aud(p.amount)} for ${r.title}`, `Your new card worked. You're all set.`);
  }
};

export const reportIssue = (issue: Omit<Issue, "status" | "at">) => (w: World) => {
  w.issues.unshift({ ...issue, status: "open", at: Date.now() });
  const p = w.pledges.find((x) => x.id === issue.pledgeId)!;
  log(w, "fan", `${p.name} reported a problem: ${issue.type.replace("_", " ")}`, issue.roundId, "warn", p.id);
  mailAdmin(w, `Problem reported on ${p.code}`, `${p.name}: “${issue.text}”`, issue.roundId);
  mailFan(w, p, "We got your report", "Thanks for letting us know. We'll sort it out within 2 working days.");
};

/* ───────────────────────── artist ───────────────────────── */

export const connectStripe = (artistId: string) => (w: World) => {
  const a = w.artists.find((x) => x.id === artistId);
  if (!a) return;
  a.stripe = "verified";
  log(w, "stripe", `${a.name} finished Stripe Connect onboarding`, undefined, "good");
};

export const createRound = (round: Round) => (w: World) => {
  w.rounds.unshift(round);
  const a = artistOf(w, round);
  log(w, "artist", `${a.name} created “${round.title}”`, round.id);
  log(w, "artist", "Submitted for review", round.id);
  mailAdmin(w, `New round to review: ${round.title}`, `${a.name} submitted ${round.title} (${aud(round.price)}, target ${round.target}).`, round.id);
  mailArtist(w, round, "Round submitted", `Thanks. We'll review ${round.title} within a day and email you when it's live.`);
};

export const decide = (roundId: string, choice: "cover" | "proceed" | "cancel") => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "awaiting_decision") return;
  r.decision = choice;
  if (choice === "cancel") {
    log(w, "artist", "Artist chose to cancel", r.id, "bad");
    cancelAndRefund(w, r, "The artist decided not to go ahead.");
    return;
  }
  if (choice === "cover") log(w, "stripe", `Artist covered shortfall of ${aud(r.shortfall ?? 0)} by card`, r.id, "money");
  else log(w, "artist", "Artist chose to proceed (printer still covered)", r.id, "good");
  confirmRound(w, r);
};

export const confirmDelivery = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "delivered") return;
  r.qcConfirmedAt = Date.now();
  const m = money(r, w.pledges);
  r.payout = { amount: m.artist, at: Date.now(), transferId: `tr_${hash(r.id + Date.now()).toString(36)}` };
  r.status = "paid_out";
  log(w, "artist", "Confirmed delivery and quality check", r.id, "good");
  log(w, "stripe", `Transfer ${r.payout.transferId}: ${aud(m.artist, { cents: true })} to ${artistOf(w, r).name}`, r.id, "money");
  mailArtist(w, r, `You've been paid ${aud(m.artist, { cents: true })}`, `Your share for ${r.title} is on its way to your bank via Stripe. It usually lands in 2 business days.`);
  for (const p of counts(r, w.pledges).paid.filter((p) => p.fulfilment === "pickup")) {
    mailFan(w, p, `Show night: bring your ticket`, `${r.title} is ready. Show your code ${p.code} at the merch desk at ${r.venue} on ${date(r.showDate)}.`);
  }
};

export const handOver = (pledgeId: string, undo = false) => (w: World) => {
  const p = w.pledges.find((x) => x.id === pledgeId);
  if (!p) return;
  const r = find(w, p.roundId);
  if (undo) {
    p.handedOverAt = undefined;
    p.status = "paid";
    log(w, "artist", `Undo hand-over for ${p.name}`, r.id, "neutral", p.id);
    return;
  }
  if (p.status !== "paid") return;
  p.handedOverAt = Date.now();
  p.status = "fulfilled";
  log(w, "artist", `Handed over to ${p.name} (${p.code})`, r.id, "good", p.id);
  maybeComplete(w, r);
};

export const markShipped = (pledgeId: string) => (w: World) => {
  const p = w.pledges.find((x) => x.id === pledgeId);
  if (!p || p.status !== "paid") return;
  const r = find(w, p.roundId);
  p.shippedAt = Date.now();
  p.status = "fulfilled";
  log(w, "artist", `Posted to ${p.name}`, r.id, "good", p.id);
  mailFan(w, p, "It's in the post", `Your ${r.title} has been posted to ${p.address}.`);
  maybeComplete(w, r);
};

export const updateArtist = (artistId: string, patch: { accent?: string; bio?: string; instagram?: string }) => (w: World) => {
  const a = w.artists.find((x) => x.id === artistId);
  if (a) Object.assign(a, patch);
};

/* ───────────────────────── admin ───────────────────────── */

export const approveRound = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "pending_review") return;
  r.status = "live";
  r.createdAt = Date.now();
  r.closesAt = Math.max(r.closesAt, Date.now() + 14 * DAY);
  r.reviewNote = undefined;
  log(w, "admin", "Approved and published", r.id, "good");
  mailArtist(w, r, `${r.title} is live`, `Your round is live until ${date(r.closesAt, true)}. Share the link: merchround.com.au/r/${r.slug}`);
};

export const requestChanges = (roundId: string, note: string) => (w: World) => {
  const r = find(w, roundId);
  r.status = "draft";
  r.reviewNote = note;
  log(w, "admin", `Requested changes: ${note}`, r.id, "warn");
  mailArtist(w, r, `Changes needed on ${r.title}`, note);
};

export const resubmit = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "draft") return;
  r.status = "pending_review";
  log(w, "artist", "Resubmitted for review", r.id);
  mailAdmin(w, `Round resubmitted: ${r.title}`, "The artist updated their round.", r.id);
};

export const sendPrinterOrder = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "confirmed") return;
  r.status = "in_production";
  r.printer.sentAt = Date.now();
  r.printer.expectedReadyAt = Date.now() + r.leadWeeks * 7 * DAY;
  const c = counts(r, w.pledges);
  const breakdown = Object.entries(c.sizes)
    .map(([s, n]) => `${s}×${n}`)
    .join(", ");
  log(w, "admin", `Order sent to ${r.printer.name}: ${breakdown}`, r.id);
  mailArtist(w, r, "Your merch is being printed", `${r.printer.name} has your order (${breakdown}). Expected ready ${date(r.printer.expectedReadyAt)}.`);
  for (const p of c.paid) mailFan(w, p, `${r.title} is being printed`, `It's happening. Expected ready ${date(r.printer.expectedReadyAt)}.`);
};

export const recordInvoice = (roundId: string, amount: number) => (w: World) => {
  const r = find(w, roundId);
  r.printer.invoiceAmount = amount;
  r.printer.invoicePaidAt = Date.now();
  log(w, "admin", `Printer invoice ${aud(amount)} uploaded and paid by bank transfer`, r.id, "money");
  if (amount > r.printerQuote)
    mailArtist(w, r, "Printer invoice came in higher", `The invoice was ${aud(amount)} vs the ${aud(r.printerQuote)} quote. The difference comes out of your share.`);
};

export const printerDelivered = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "in_production") return;
  if (!r.printer.invoiceAmount) {
    r.printer.invoiceAmount = r.printerQuote;
    r.printer.invoicePaidAt = Date.now();
    log(w, "admin", `Printer invoice ${aud(r.printerQuote)} paid by bank transfer`, r.id, "money");
  }
  r.status = "delivered";
  r.printer.deliveredAt = Date.now();
  log(w, "printer", `Merch delivered to ${artistOf(w, r).name}`, r.id, "good");
  mailArtist(w, r, "Your merch has arrived", `${r.printer.name} delivered ${r.title}. Check it over and confirm to get paid.`);
};

export const resolveIssue = (issueId: string, resolution: "refunded" | "replaced" | "rejected") => (w: World) => {
  const i = w.issues.find((x) => x.id === issueId);
  if (!i) return;
  i.status = resolution;
  i.resolvedAt = Date.now();
  const p = w.pledges.find((x) => x.id === i.pledgeId)!;
  if (resolution === "refunded") {
    p.status = "refunded";
    p.refundedAt = Date.now();
    log(w, "stripe", `Refund ${aud(p.amount)} to ${p.name}`, i.roundId, "money", p.id);
    mailFan(w, p, `Refunded ${aud(p.amount)}`, "Sorry about that. Your refund is on its way and should show in 5–10 days.");
  } else if (resolution === "replaced") {
    log(w, "admin", `Replacement arranged for ${p.name}`, i.roundId, "good", p.id);
    mailFan(w, p, "Replacement on the way", "We've arranged a replacement. We'll email when it ships.");
  } else {
    log(w, "admin", `Report from ${p.name} closed without action`, i.roundId, "neutral", p.id);
    mailFan(w, p, "About your report", "We looked into it and couldn't find a problem. Reply to this email if we got it wrong.");
  }
};

export const adminCancel = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  log(w, "admin", "Round cancelled by Merch Round", r.id, "bad");
  cancelAndRefund(w, r, "This round was cancelled by Merch Round.");
};

/* ───────────────────────── simulation (time travel) ───────────────────────── */

export const simAddPledges = (roundId: string, n: number) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "live") return;
  const names = ["Tess", "Jonah", "Ari", "Nina", "Felix", "Lola", "Remy", "Esme", "Hugo", "Billie", "Otis", "Pia"];
  const lasts = ["Fox", "Lane", "Quinn", "Reid", "Stone", "Vale", "West", "Young"];
  for (let i = 0; i < n; i++) {
    const id = uid("p");
    const h = hash(id);
    const name = `${names[h % names.length]} ${lasts[(h >> 4) % lasts.length]}`;
    createPledge(r.id, {
      id,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      size: r.sizes[h % r.sizes.length],
      fulfilment: r.delivery && h % 4 === 0 ? "delivery" : "pickup",
      address: "1 Sample Rd, Newtown NSW 2042",
      last4: String(1000 + (h % 9000)),
      brand: h % 2 ? "Visa" : "Mastercard",
    })(w);
  }
};

function chargeOne(w: World, r: Round, p: Pledge) {
  p.attempts += 1;
  const isDemoFan = p.email.endsWith("@demo.fan");
  const roll = isDemoFan ? 99 : hash(p.id + ":" + p.attempts) % 20;
  if (roll === 0) {
    p.status = "action_required";
    p.declineReason = "Bank needs you to confirm";
    mailFan(w, p, `Your bank wants a quick yes (${aud(p.amount)})`, `Confirm your payment for ${r.title} before ${dateTime(r.chargeDeadline!)} to keep your spot.`);
  } else if (roll === 1) {
    p.status = "card_update_required";
    p.declineReason = "Card expired";
    mailFan(w, p, "Your card didn't work", `Your card ending ${p.card.last4} was declined (expired). Add a new card to keep your ${r.title}.`);
  } else if (roll <= 3) {
    p.status = "retry_scheduled";
    p.declineReason = "Insufficient funds";
    mailFan(w, p, "We'll try your card again tomorrow", `Your payment for ${r.title} didn't go through. We'll retry within 24 hours.`);
  } else {
    p.status = "paid";
    p.paidAt = Date.now();
    p.declineReason = undefined;
    mailFan(w, p, `Paid: ${aud(p.amount)} for ${r.title}`, `It's happening. Your ${r.title} is paid for. Receipt and ticket in your order page.`);
  }
}

function runCharges(w: World, r: Round) {
  const due = w.pledges.filter((p) => p.roundId === r.id && (p.status === "pledged"));
  for (const p of due) chargeOne(w, r, p);
  const c = counts(r, w.pledges);
  log(
    w,
    "stripe",
    `${due.length} off-session charges: ${c.paidCount} paid, ${c.owed.length} need attention`,
    r.id,
    c.owed.length ? "warn" : "money",
  );
}

export const simClose = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "live") return;
  r.closesAt = Date.now();
  const c = counts(r, w.pledges);
  if (c.pledgedCount < r.target) {
    r.status = "failed";
    for (const p of c.active) {
      p.status = "released";
      mailFan(w, p, "Not this time. You weren't charged.", `${r.title} closed at ${c.pledgedCount} of ${r.target}. Your saved card was released. Nothing was charged.`);
    }
    log(w, "system", `Closed at ${c.pledgedCount} of ${r.target}. Nobody charged, cards released.`, r.id, "bad");
    mailArtist(w, r, `${r.title} didn't reach ${r.target}`, `It closed at ${c.pledgedCount}. Nobody was charged and nothing will be printed. You can start a new round any time.`);
    return;
  }
  r.status = "charging";
  r.chargeDeadline = Date.now() + 72 * HOUR;
  log(w, "system", `Closed at ${c.pledgedCount} pledges (target ${r.target}). Charging saved cards.`, r.id, "good");
  mailArtist(w, r, `${r.title} closed at ${c.pledgedCount}`, "We're charging fans now. Declined cards get retried for 72 hours.");
  runCharges(w, r);
};

export const simRetry = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "charging") return;
  const due = w.pledges.filter((p) => p.roundId === r.id && p.status === "retry_scheduled");
  let ok = 0;
  for (const p of due) {
    p.attempts += 1;
    if (hash(p.id + p.attempts) % 3 !== 0) {
      p.status = "paid";
      p.paidAt = Date.now();
      p.declineReason = undefined;
      ok++;
      mailFan(w, p, `Paid: ${aud(p.amount)} for ${r.title}`, "Second try worked. You're all set.");
    }
  }
  log(w, "stripe", `Retried ${due.length} soft declines: ${ok} succeeded`, r.id, "money");
};

export const simFansAct = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  const due = w.pledges.filter(
    (p) => p.roundId === r.id && (p.status === "action_required" || p.status === "card_update_required") && !p.email.endsWith("@demo.fan"),
  );
  for (const [i, p] of due.entries()) {
    if (i % 2 === 0) {
      if (p.status === "action_required") confirmAuth(p.id)(w);
      else updateCard(p.id, "4444")(w);
    }
  }
};

export const simEndWindow = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "charging") return;
  r.chargeDeadline = Date.now();
  for (const p of w.pledges.filter((x) => x.roundId === r.id && OWED.includes(x.status))) {
    p.status = "unpaid";
    p.declineReason = "Not paid within 72 hours";
    mailFan(w, p, "Your pledge has lapsed", `We couldn't take payment for ${r.title}, so your spot has been released.`);
  }
  const c = counts(r, w.pledges);
  if (c.paidCount >= r.target) {
    log(w, "system", `72-hour window ended: ${c.paidCount} paid. Target met.`, r.id, "good");
    confirmRound(w, r);
    return;
  }
  const m = money(r, w.pledges);
  r.shortfall = round2(Math.max(0, r.printerQuote - (m.paidGross - m.paidGross * FEE_RATE)));
  r.status = "awaiting_decision";
  r.decisionDeadline = Date.now() + 48 * HOUR;
  log(w, "system", `72-hour window ended: ${c.paidCount} of ${r.target} paid. Short of target.`, r.id, "warn");
  mailArtist(
    w,
    r,
    `Decision needed: ${r.title} is ${r.target - c.paidCount} short`,
    r.shortfall
      ? `To print anyway, cover ${aud(r.shortfall, { cents: true })}. Or cancel and refund fans. Decide by ${dateTime(r.decisionDeadline)}.`
      : `The printer is still covered. Proceed or cancel by ${dateTime(r.decisionDeadline)}.`,
  );
};

export const simExpireDecision = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  if (r.status !== "awaiting_decision") return;
  r.decision = "expired";
  log(w, "system", "No decision within 48 hours. Cancelling.", r.id, "bad");
  cancelAndRefund(w, r, "The artist didn't confirm in time, so the round was cancelled.");
};

export const simShowNight = (roundId: string) => (w: World) => {
  const r = find(w, roundId);
  for (const p of counts(r, w.pledges).paid) {
    if (p.status !== "paid") continue;
    if (p.email.endsWith("@demo.fan")) continue;
    p.status = "fulfilled";
    if (p.fulfilment === "delivery") p.shippedAt = Date.now();
    else p.handedOverAt = Date.now();
  }
  log(w, "artist", "Show night: handed over everything except Sam's order", r.id, "good");
};

/* ───────────────────────── internals ───────────────────────── */

function confirmRound(w: World, r: Round) {
  r.status = "confirmed";
  const c = counts(r, w.pledges);
  log(w, "system", `Round confirmed with ${c.paidCount} paid orders`, r.id, "good");
  mailAdmin(w, `Send to printer: ${r.title}`, `${c.paidCount} paid. Send the order to ${r.printer.name}.`, r.id);
  mailArtist(w, r, `${r.title} is confirmed`, `${c.paidCount} fans paid. We're sending the order to ${r.printer.name}.`);
}

function cancelAndRefund(w: World, r: Round, why: string) {
  r.status = "cancelled";
  let refunded = 0;
  for (const p of w.pledges.filter((x) => x.roundId === r.id)) {
    if (p.status === "paid" || p.status === "fulfilled") {
      p.status = "refunded";
      p.refundedAt = Date.now();
      refunded++;
      mailFan(w, p, "Round cancelled. You've been refunded.", `${why} Your ${aud(p.amount)} is on its way back (5–10 days).`);
    } else if (["pledged", ...OWED].includes(p.status)) {
      p.status = "released";
      mailFan(w, p, "Round cancelled. You weren't charged.", `${why} Nothing was charged.`);
    }
  }
  if (refunded) log(w, "stripe", `Refunded ${refunded} charges. Stripe keeps its processing fee.`, r.id, "money");
  mailArtist(w, r, `${r.title} was cancelled`, `${why} ${refunded ? `${refunded} fans were refunded.` : "Nobody was charged."}`);
}

function maybeComplete(w: World, r: Round) {
  if (r.status !== "paid_out") return;
  const c = counts(r, w.pledges);
  if (c.paid.every((p) => p.status === "fulfilled")) {
    r.status = "completed";
    log(w, "system", "Every order handed over or posted. Round complete.", r.id, "good");
  }
}
