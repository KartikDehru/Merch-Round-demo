"use client";

import Link from "next/link";
import { useWorld } from "@/lib/store";
import { money } from "@/lib/domain";
import { aud } from "@/lib/format";
import { RequireRole } from "@/components/require-role";
import { EventFeed } from "@/components/event-feed";
import { H1, Label, Panel, RoundPill, Stat } from "@/components/ui";

export default function Ledger() {
  return (
    <RequireRole role="admin">
      <Inner />
    </RequireRole>
  );
}

function Inner() {
  const { world } = useWorld();
  const rows = world.rounds
    .filter((r) => !["live", "draft", "pending_review", "failed"].includes(r.status))
    .map((r) => ({ r, a: world.artists.find((x) => x.id === r.artistId)!, m: money(r, world.pledges) }));
  const sum = (f: (x: (typeof rows)[number]) => number) => rows.reduce((s, x) => s + f(x), 0);
  const gross = sum((x) => x.m.paidGross);
  const fee = sum((x) => x.m.fee);
  const cardFees = sum((x) => x.m.cardFees);
  const printerPaid = sum((x) => (x.r.printer.invoicePaidAt ? x.m.printer : 0));
  const artistPaid = sum((x) => x.r.payout?.amount ?? 0);
  const refunds = sum((x) => x.m.refundedGross);
  const held = gross - printerPaid - artistPaid - cardFees;

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
      <Label>ledger</Label>
      <H1 className="mt-3">Where the money is.</H1>
      <div className="mt-8 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-5">
        <Stat className="bg-card p-5" label="charged" value={aud(gross)} />
        <Stat className="bg-card p-5" label="printers paid" value={aud(printerPaid)} />
        <Stat className="bg-card p-5" label="artists paid" value={aud(artistPaid)} />
        <Stat className="bg-card p-5" label="our net" value={aud(fee - cardFees)} sub={`fee ${aud(fee)} − cards ${aud(cardFees)}`} />
        <Stat className="bg-card p-5" label="balance held" value={aud(held)} sub={refunds ? `${aud(refunds)} refunded` : "in Stripe"} />
      </div>

      <div className="mt-8 overflow-x-auto border border-line bg-card">
        <table className="w-full min-w-[960px] text-left text-[13px]">
          <thead className="border-b border-line bg-haze/60">
            <tr className="label">
              <th className="px-4 py-3 font-normal">Round</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 text-right font-normal">Charged</th>
              <th className="px-4 py-3 text-right font-normal">Fee 10%</th>
              <th className="px-4 py-3 text-right font-normal">Card fees</th>
              <th className="px-4 py-3 text-right font-normal">Printer</th>
              <th className="px-4 py-3 text-right font-normal">Artist</th>
              <th className="px-4 py-3 text-right font-normal">Refunded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line tabular">
            {rows.map(({ r, a, m }) => (
              <tr key={r.id} className="hover:bg-haze/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/rounds/${r.id}`} className="font-display font-bold hover:underline">{r.title}</Link>
                  <div className="text-[11px] text-mute">{a.name}</div>
                </td>
                <td className="px-4 py-3"><RoundPill status={r.status} /></td>
                <td className="px-4 py-3 text-right">{aud(m.paidGross, { cents: true })}</td>
                <td className="px-4 py-3 text-right">{aud(m.fee, { cents: true })}</td>
                <td className="px-4 py-3 text-right text-ash">−{aud(m.cardFees, { cents: true })}</td>
                <td className="px-4 py-3 text-right">{r.printer.invoicePaidAt ? aud(m.printer, { cents: true }) : <span className="text-mute">due {aud(m.printer)}</span>}</td>
                <td className="px-4 py-3 text-right">{r.payout ? aud(r.payout.amount, { cents: true }) : <span className="text-mute">owed {aud(m.artist, { cents: true })}</span>}</td>
                <td className="px-4 py-3 text-right text-ash">{m.refundedGross ? aud(m.refundedGross, { cents: true }) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Panel title="money movements" className="mt-8">
        <EventFeed events={world.events.filter((e) => e.tone === "money")} limit={60} showRound />
      </Panel>
    </div>
  );
}
