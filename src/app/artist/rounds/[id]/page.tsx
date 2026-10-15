"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import { confirmDelivery, decide, login, markShipped, resubmit } from "@/lib/actions";
import { money, projectedAtTarget } from "@/lib/domain";
import { aud, date, dateTime } from "@/lib/format";
import { RequireRole } from "@/components/require-role";
import { DemoControls, ProgressBlock, Receipt, SizeBars, useRound } from "@/components/round-bits";
import { Lifecycle } from "@/components/lifecycle";
import { EventFeed } from "@/components/event-feed";
import { MerchMock } from "@/components/visuals";
import { Button, LinkButton, Label, Panel, PledgePill, RoundPill, Segmented, Stamp, cx } from "@/components/ui";

type Tab = "overview" | "fans" | "money" | "production" | "activity";

export default function ArtistRound() {
  return (
    <RequireRole role="artist">
      <Inner />
    </RequireRole>
  );
}

function Inner() {
  const { id } = useParams<{ id: string }>();
  const { round, artist, c } = useRound(id);
  const { world, act, toast } = useWorld();
  const [tab, setTab] = useState<Tab>("overview");
  const [checks, setChecks] = useState([false, false, false]);

  if (!round || !artist || !c) return <div className="p-20 text-center font-display text-[40px] text-ash">Round not found</div>;
  if (round.artistId !== world.session.artistId)
    return (
      <div className="mx-auto max-w-[560px] p-20 text-center">
        <div className="font-display text-[40px] leading-none">Not your round</div>
        <p className="mt-2 text-ash">This round belongs to {artist.name}.</p>
        <Button className="mt-5" variant="brick" onClick={() => act(login("artist", artist.id))}>
          Sign in as {artist.name} →
        </Button>
      </div>
    );

  const m = money(round, world.pledges);
  const proj = projectedAtTarget(round);
  const pre = ["live", "draft", "pending_review"].includes(round.status);
  const deskReady = ["delivered", "paid_out", "completed"].includes(round.status);

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8">
      <Link href="/artist" className="label hover:text-ink">← dashboard</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="hidden size-20 border border-line dotgrid bg-card sm:block">
            <MerchMock product={round.product} colorway={round.colorway} motif={round.motif} accent={artist.accent} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <RoundPill status={round.status} />
              <span className="text-[12px] text-mute">{aud(round.price)} · target {round.target} · {round.printer.name}</span>
            </div>
            <h1 className="mt-2 font-display text-[34px] leading-none font-bold tracking-tight uppercase sm:text-[44px]">{round.title}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href={`/r/${round.slug}`} variant="secondary">Public page ↗</LinkButton>
          {deskReady && <LinkButton href={`/artist/rounds/${round.id}/desk`} variant="primary">Merch desk</LinkButton>}
        </div>
      </div>

      <div className="mt-8">
        <Lifecycle round={round} />
      </div>

      {/* ───── decision takeover ───── */}
      {round.status === "awaiting_decision" && (
        <section className="mt-8 border-t-[6px] border-brick bg-card p-6 sm:p-10">
          <Label>decision needed · by {dateTime(round.decisionDeadline!)}</Label>
          <h2 className="mt-3 font-display text-[44px] leading-[0.95] uppercase sm:text-[64px]">
            You&apos;re {round.target - c.paidCount} short.
          </h2>
          <p className="mt-4 max-w-[640px] text-[15px] text-ash">
            {c.paidCount} of {round.target} paid after 72 hours of retries.{" "}
            {round.shortfall
              ? <>To print anyway, cover <b className="text-ink">{aud(round.shortfall, { cents: true })}</b> so the printer is paid in full.</>
              : <>The printer is still covered by what fans paid, so you can go ahead.</>}{" "}
            If you don&apos;t decide in time, the round is cancelled and fans are refunded.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="brick"
              size="lg"
              onClick={() => {
                act(decide(round.id, round.shortfall ? "cover" : "proceed"));
                toast(round.shortfall ? `Covered ${aud(round.shortfall, { cents: true })}. Round confirmed.` : "Round confirmed", "good");
              }}
            >
              {round.shortfall ? `Cover ${aud(round.shortfall, { cents: true })} and print` : "Go ahead and print"}
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={() => {
                if (confirm("Cancel and refund every fan?")) {
                  act(decide(round.id, "cancel"));
                  toast("Round cancelled. Fans refunded.", "bad");
                }
              }}
            >
              Cancel and refund fans
            </Button>
          </div>
        </section>
      )}

      {/* ───── confirm delivery ───── */}
      {round.status === "delivered" && (
        <section className="mt-8 border-2 border-ink bg-brick-soft p-6 sm:p-8">
          <Label>merch arrived {round.printer.deliveredAt ? date(round.printer.deliveredAt) : ""}</Label>
          <h2 className="mt-2 font-display text-[32px] leading-none uppercase">Check it, then get paid.</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {[`Count matches (${c.paidCount} items)`, "Print quality looks right", "Sizes match the order"].map((t, i) => (
              <label key={t} className={cx("flex cursor-pointer items-center gap-3 border bg-card p-3 text-[13px]", checks[i] ? "border-ink" : "border-line")}>
                <input type="checkbox" className="size-4 accent-ink" checked={checks[i]} onChange={() => setChecks((c) => c.map((v, k) => (k === i ? !v : v)))} />
                {t}
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              disabled={!checks.every(Boolean)}
              onClick={() => {
                act(confirmDelivery(round.id));
                toast(`Paid ${aud(m.artist, { cents: true })} via Stripe`, "good");
              }}
            >
              Confirm & get paid {aud(m.artist, { cents: true })}
            </Button>
            <button className="text-[12px] uppercase tracking-[0.14em] text-stop underline underline-offset-4" onClick={() => toast("Problem reported to Merch Round (demo)", "warn")}>
              Something&apos;s wrong
            </button>
          </div>
        </section>
      )}

      {round.status === "draft" && round.reviewNote && (
        <section className="mt-8 flex flex-wrap items-center gap-4 border-2 border-hold bg-hold-soft p-5">
          <div className="flex-1">
            <div className="font-display text-[18px] font-bold">Changes requested</div>
            <div className="text-[13px]">{round.reviewNote}</div>
          </div>
          <Button onClick={() => { act(resubmit(round.id)); toast("Resubmitted for review", "good"); }}>Resubmit</Button>
        </section>
      )}

      {round.payout && (
        <div className="mt-8 flex flex-wrap items-center gap-4 border border-line bg-card p-4">
          <Stamp tone="go" rot={-3}>Paid</Stamp>
          <div className="text-[13px]">
            <b>{aud(round.payout.amount, { cents: true })}</b> sent {date(round.payout.at)} · Stripe transfer <code className="text-ash">{round.payout.transferId}</code>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-3">
        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: "overview", label: "Overview" },
            { value: "fans", label: `Fans (${c.all.length})` },
            { value: "money", label: "Money" },
            { value: "production", label: "Production" },
            { value: "activity", label: "Activity" },
          ]}
        />
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6">
              <Panel title="progress">
                <ProgressBlock round={round} artist={artist} big />
              </Panel>
              <Panel title={pre ? "Size breakdown · asked for" : "Size breakdown · paid"}>
                <SizeBars sizes={c.sizes} accent={artist.accent} />
              </Panel>
            </div>
            <div className="space-y-6">
              <DemoControls round={round} compact />
              <Panel title="key dates">
                <Receipt
                  rows={[
                    { label: "Opened", value: date(round.createdAt) },
                    { label: "Closes", value: dateTime(round.closesAt) },
                    ...(round.chargeDeadline ? [{ label: "Charge window ends", value: dateTime(round.chargeDeadline) }] : []),
                    ...(round.printer.expectedReadyAt ? [{ label: "Printer ready", value: date(round.printer.expectedReadyAt) }] : []),
                    { label: "Show", value: date(round.showDate, true) },
                  ]}
                />
              </Panel>
            </div>
          </div>
        )}

        {tab === "fans" && (
          <div className="overflow-x-auto border border-line bg-card">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead className="border-b border-line bg-haze/60">
                <tr className="label">
                  <th className="px-4 py-3 font-normal">Fan</th>
                  <th className="px-4 py-3 font-normal">Size</th>
                  <th className="px-4 py-3 font-normal">Get it</th>
                  <th className="px-4 py-3 font-normal">Code</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[...c.all].sort((a, b) => b.createdAt - a.createdAt).map((p) => (
                  <tr key={p.id} className="hover:bg-haze/50">
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[11px] text-mute">{date(p.createdAt)}</div>
                    </td>
                    <td className="px-4 py-2.5 font-display font-bold">{p.size}</td>
                    <td className="px-4 py-2.5 text-ash">{p.fulfilment === "pickup" ? "Pick up" : "Post"}</td>
                    <td className="px-4 py-2.5 font-display">{p.code}</td>
                    <td className="px-4 py-2.5"><PledgePill status={p.status} /></td>
                    <td className="px-4 py-2.5 text-right">
                      {p.fulfilment === "delivery" && p.status === "paid" && ["paid_out", "delivered"].includes(round.status) && (
                        <Button size="sm" variant="secondary" onClick={() => { act(markShipped(p.id)); toast(`Marked posted to ${p.name}`, "good"); }}>
                          Mark posted
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between border-t border-line p-3 text-[12px] text-ash">
              <span>Emails stay private unless fans opt in to updates.</span>
              <button className="uppercase tracking-[0.14em] underline" onClick={() => toast("CSV exported (demo)", "good")}>Export CSV</button>
            </div>
          </div>
        )}

        {tab === "money" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title={pre ? "if it hits target" : "your money"}>
              {pre ? (
                <Receipt
                  rows={[
                    { label: `Fans pay (${round.target} × ${aud(round.price)})`, value: aud(proj.gross, { cents: true }) },
                    { label: "Merch Round 10%", value: `−${aud(proj.fee, { cents: true })}` },
                    { label: "Printer quote", value: `−${aud(proj.printer, { cents: true })}` },
                  ]}
                  total={{ label: "You get", value: aud(proj.artist, { cents: true }) }}
                />
              ) : (
                <Receipt
                  rows={[
                    { label: `Fans paid (${c.paidCount})`, value: aud(m.paidGross, { cents: true }) },
                    { label: "Merch Round 10%", value: `−${aud(m.fee, { cents: true })}` },
                    { label: round.printer.invoiceAmount ? "Printer invoice" : "Printer quote", value: `−${aud(m.printer, { cents: true })}` },
                    ...(m.covered ? [{ label: "You covered shortfall", value: `+${aud(m.covered, { cents: true })}` }] : []),
                    ...(m.refundedGross ? [{ label: `Refunded (${c.refunded.length})`, value: aud(m.refundedGross, { cents: true }), muted: true }] : []),
                  ]}
                  total={{ label: round.payout ? "Paid to you" : "Your share", value: aud(round.payout?.amount ?? m.artist, { cents: true }) }}
                />
              )}
            </Panel>
            <Panel title="how the money moves">
              <ol className="space-y-3 text-[13px]">
                {[
                  ["Fans", "Cards charged by Stripe when the round succeeds. Money sits in Merch Round's Stripe balance."],
                  ["Printer", "Merch Round pays the printer's invoice by bank transfer."],
                  ["You", "When you confirm delivery, your share is transferred to your Stripe account and paid to your bank."],
                  ["Card fees", "Covered by Merch Round's 10%. Nothing extra comes out of your share."],
                ].map(([t, b], i) => (
                  <li key={t} className="flex gap-3">
                    <span className="font-display text-mute">{String(i + 1).padStart(2, "0")}</span>
                    <span><b>{t}.</b> <span className="text-ash">{b}</span></span>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        )}

        {tab === "production" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="printer">
              <Receipt
                rows={[
                  { label: "Printer", value: round.printer.name },
                  { label: "Quote", value: aud(round.printerQuote) },
                  { label: "Min run", value: String(round.minRun) },
                  { label: "Lead time", value: `${round.leadWeeks} weeks` },
                  { label: "Order sent", value: round.printer.sentAt ? date(round.printer.sentAt) : "—" },
                  { label: "Invoice", value: round.printer.invoiceAmount ? `${aud(round.printer.invoiceAmount)} · paid` : "—" },
                  { label: "Expected ready", value: round.printer.expectedReadyAt ? date(round.printer.expectedReadyAt) : "—" },
                  { label: "Delivered", value: round.printer.deliveredAt ? date(round.printer.deliveredAt) : "—" },
                ]}
              />
            </Panel>
            <Panel title="order sheet">
              <SizeBars sizes={c.sizes} accent={artist.accent} />
              <div className="mt-4 text-[12px] text-ash">
                Pick-ups: {c.paid.filter((p) => p.fulfilment === "pickup").length} · Posted: {c.paid.filter((p) => p.fulfilment === "delivery").length}
              </div>
            </Panel>
          </div>
        )}

        {tab === "activity" && (
          <Panel title="activity">
            <EventFeed events={world.events.filter((e) => e.roundId === round.id)} limit={80} />
          </Panel>
        )}
      </div>
    </div>
  );
}
