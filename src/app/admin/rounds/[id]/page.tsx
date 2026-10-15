"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useWorld } from "@/lib/store";
import * as A from "@/lib/actions";
import { money } from "@/lib/domain";
import { aud, date, dateTime } from "@/lib/format";
import { RequireRole } from "@/components/require-role";
import { DemoControls, ProgressBlock, Receipt, SizeBars, useRound } from "@/components/round-bits";
import { Lifecycle } from "@/components/lifecycle";
import { EventFeed } from "@/components/event-feed";
import { Button, LinkButton, Label, Panel, PledgePill, RoundPill } from "@/components/ui";

export default function AdminRound() {
  return (
    <RequireRole role="admin">
      <Inner />
    </RequireRole>
  );
}

function Inner() {
  const { id } = useParams<{ id: string }>();
  const { round, artist, c } = useRound(id);
  const { world, act, toast } = useWorld();
  if (!round || !artist || !c) return <div className="p-20 text-center font-display text-[40px] text-ash">Round not found</div>;
  const m = money(round, world.pledges);
  const canCancel = ["live", "charging", "awaiting_decision", "confirmed"].includes(round.status);

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8">
      <Link href="/admin" className="label hover:text-ink">← queue</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RoundPill status={round.status} />
            <span className="text-[12px] text-mute">{round.id}</span>
          </div>
          <h1 className="mt-2 font-display text-[34px] leading-none font-bold uppercase sm:text-[44px]">{round.title}</h1>
          <div className="mt-1 text-[13px] text-ash">
            {artist.name} · {artist.city} · Stripe {artist.stripe}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href={`/r/${round.slug}`} variant="secondary">Public page ↗</LinkButton>
          {round.status === "pending_review" && (
            <Button variant="brick" onClick={() => { act(A.approveRound(round.id)); toast("Approved", "good"); }}>Approve</Button>
          )}
          {round.status === "confirmed" && (
            <Button variant="brick" onClick={() => { act(A.sendPrinterOrder(round.id)); toast("Order sent", "good"); }}>Send printer order</Button>
          )}
          {round.status === "in_production" && (
            <Button variant="brick" onClick={() => { act(A.printerDelivered(round.id)); toast("Marked delivered", "good"); }}>Mark delivered</Button>
          )}
          {canCancel && (
            <Button
              variant="danger"
              onClick={() => {
                if (confirm("Cancel this round? Paid fans are refunded, saved cards released.")) {
                  act(A.adminCancel(round.id));
                  toast("Round cancelled", "bad");
                }
              }}
            >
              Cancel round
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Lifecycle round={round} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Panel title="progress" className="lg:col-span-2">
          <ProgressBlock round={round} artist={artist} />
        </Panel>
        <DemoControls round={round} compact />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="money">
          <Receipt
            rows={[
              { label: round.status === "live" ? "Asked for (not charged)" : "Fans paid", value: aud(round.status === "live" ? m.pledgedGross : m.paidGross, { cents: true }) },
              { label: "Platform fee 10%", value: aud(m.fee, { cents: true }) },
              { label: "Est. Stripe card fees", value: `−${aud(m.cardFees, { cents: true })}`, muted: true },
              { label: "Printer", value: `${aud(m.printer, { cents: true })}${round.printer.invoicePaidAt ? " · paid" : ""}` },
              ...(m.covered ? [{ label: "Artist covered", value: aud(m.covered, { cents: true }) }] : []),
              ...(m.refundedGross ? [{ label: "Refunded", value: aud(m.refundedGross, { cents: true }), muted: true }] : []),
              { label: round.payout ? "Paid to artist" : "Owed to artist", value: aud(round.payout?.amount ?? m.artist, { cents: true }) },
            ]}
            total={{ label: "Our net", value: aud(m.platformNet, { cents: true }) }}
          />
        </Panel>
        <Panel title="numbers">
          <Receipt
            rows={[
              { label: "Price", value: aud(round.price) },
              { label: "Target", value: String(round.target) },
              { label: "Printer quote", value: aud(round.printerQuote) },
              { label: "Min run", value: String(round.minRun) },
              { label: "Closes", value: dateTime(round.closesAt) },
              ...(round.chargeDeadline ? [{ label: "Charge window", value: dateTime(round.chargeDeadline) }] : []),
              ...(round.decisionDeadline ? [{ label: "Decision by", value: dateTime(round.decisionDeadline) }] : []),
              { label: "Show", value: `${round.venue.split(",")[0]} · ${date(round.showDate)}` },
            ]}
          />
        </Panel>
        <Panel title="sizes">
          <SizeBars sizes={c.sizes} accent={artist.accent} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="overflow-x-auto border border-line bg-card">
          <header className="border-b border-line px-4 py-3">
            <Label>pledges ({c.all.length})</Label>
          </header>
          <table className="w-full min-w-[640px] text-left text-[12px]">
            <thead className="border-b border-line bg-haze/60">
              <tr className="label">
                <th className="px-4 py-2 font-normal">Fan</th>
                <th className="px-4 py-2 font-normal">Card</th>
                <th className="px-4 py-2 font-normal">Tries</th>
                <th className="px-4 py-2 font-normal">Amount</th>
                <th className="px-4 py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {c.all.map((p) => (
                <tr key={p.id} className="hover:bg-haze/50">
                  <td className="px-4 py-2">
                    <Link href={`/o/${p.id}`} className="hover:underline">{p.name}</Link>
                    <div className="text-[11px] text-mute">{p.email}</div>
                  </td>
                  <td className="px-4 py-2 text-ash">{p.card.brand} •••• {p.card.last4}</td>
                  <td className="px-4 py-2 tabular">{p.attempts}</td>
                  <td className="px-4 py-2 tabular">{aud(p.amount)}</td>
                  <td className="px-4 py-2">
                    <PledgePill status={p.status} />
                    {p.declineReason && <div className="mt-0.5 text-[10px] text-mute">{p.declineReason}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <Panel title="audit log" className="self-start">
          <EventFeed events={world.events.filter((e) => e.roundId === round.id)} limit={60} />
        </Panel>
      </div>
    </div>
  );
}
