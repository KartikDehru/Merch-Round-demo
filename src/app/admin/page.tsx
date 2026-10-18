"use client";

import Link from "next/link";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import * as A from "@/lib/actions";
import { counts, money } from "@/lib/domain";
import { aud, date, dateTime } from "@/lib/format";
import type { Round } from "@/lib/types";
import { RequireRole } from "@/components/require-role";
import { EventFeed } from "@/components/event-feed";
import { Button, H1, Input, Label, Panel, Pill, Stat } from "@/components/ui";

export default function AdminPage() {
  return (
    <RequireRole role="admin">
      <Queue />
    </RequireRole>
  );
}

function Queue() {
  const { world, act, toast } = useWorld();
  const by = (s: Round["status"][]) => world.rounds.filter((r) => s.includes(r.status));
  const artistName = (r: Round) => world.artists.find((a) => a.id === r.artistId)!.name;

  const totals = world.rounds.reduce(
    (t, r) => {
      const m = money(r, world.pledges);
      if (["live", "draft", "pending_review", "failed"].includes(r.status)) return t;
      t.gross += m.paidGross;
      t.net += m.platformNet;
      if (!r.payout && r.status !== "cancelled") t.held += m.paidGross - (r.printer.invoicePaidAt ? m.printer : 0);
      return t;
    },
    { gross: 0, net: 0, held: 0 },
  );
  const openIssues = world.issues.filter((i) => i.status === "open");

  const groups: { key: string; title: string; hint: string; rounds: Round[]; render: (r: Round) => React.ReactNode }[] = [
    {
      key: "review",
      title: "review",
      hint: "Check the printer quote looks real, then publish.",
      rounds: by(["pending_review"]),
      render: (r) => <ReviewActions r={r} />,
    },
    {
      key: "printer",
      title: "send to printer",
      hint: "Round confirmed. Email the size breakdown.",
      rounds: by(["confirmed"]),
      render: (r) => (
        <Button size="sm" variant="brick" onClick={() => { act(A.sendPrinterOrder(r.id)); toast(`Order sent to ${r.printer.name}`, "good"); }}>
          Send order
        </Button>
      ),
    },
    {
      key: "production",
      title: "in production",
      hint: "Record the invoice, pay it, mark delivered.",
      rounds: by(["in_production"]),
      render: (r) => <ProductionActions r={r} />,
    },
    {
      key: "charging",
      title: "charging",
      hint: "Stripe is retrying declines for 72h.",
      rounds: by(["charging"]),
      render: (r) => {
        const c = counts(r, world.pledges);
        return (
          <span className="text-[12px] text-ash">
            {c.paidCount} paid · <span className="text-hold">{c.owed.length} owed</span> · ends {dateTime(r.chargeDeadline!)}
          </span>
        );
      },
    },
    {
      key: "decision",
      title: "waiting on artist decision",
      hint: "Auto-cancels at the deadline.",
      rounds: by(["awaiting_decision"]),
      render: (r) => <span className="text-[12px] text-hold">short {aud(r.shortfall ?? 0, { cents: true })} · by {dateTime(r.decisionDeadline!)}</span>,
    },
    {
      key: "payout",
      title: "waiting on artist QC",
      hint: "Payout is sent when the artist confirms delivery.",
      rounds: by(["delivered"]),
      render: (r) => (
        <span className="text-[12px] text-ash">
          delivered {date(r.printer.deliveredAt!)} · payout {aud(money(r, world.pledges).artist, { cents: true })}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
      <Label>merch round admin · priya</Label>
      <H1 className="mt-3">Queue.</H1>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat className="bg-stone p-5" label="fans charged" value={aud(totals.gross)} sub="active + completed rounds" />
        <Stat className="bg-stone p-5" label="our net" value={aud(totals.net)} sub="10% minus card fees" />
        <Stat className="bg-stone p-5" label="held in stripe" value={aud(totals.held)} sub="not yet paid out" />
        <Stat className="bg-stone p-5" label="live rounds" value={by(["live"]).length} sub={`${world.pledges.filter((p) => p.status === "pledged").length} saved cards`} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {groups.map((g) => (
            <section key={g.key} className="border border-line bg-card">
              <header className="flex items-center justify-between border-b border-line px-4 py-3">
                <div>
                  <Label>{g.title}</Label>
                  <div className="mt-0.5 text-[11px] text-mute">{g.hint}</div>
                </div>
                <Pill tone={g.rounds.length ? (g.key === "review" || g.key === "printer" ? "warn" : "neutral") : "neutral"}>{g.rounds.length}</Pill>
              </header>
              {g.rounds.length ? (
                <ul className="divide-y divide-line">
                  {g.rounds.map((r) => (
                    <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                      <Link href={`/admin/rounds/${r.id}`} className="min-w-0 flex-1 hover:underline">
                        <div className="font-display text-[16px] font-bold">{r.title}</div>
                        <div className="text-[12px] text-ash">
                          {artistName(r)} · {aud(r.price)} · target {r.target} · {r.printer.name}
                        </div>
                      </Link>
                      {g.render(r)}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-4 text-[12px] text-mute">Nothing here.</div>
              )}
            </section>
          ))}

          <section className="border border-line bg-card">
            <header className="flex items-center justify-between border-b border-line px-4 py-3">
              <Label>problems reported</Label>
              <Pill tone={openIssues.length ? "bad" : "neutral"}>{openIssues.length}</Pill>
            </header>
            {world.issues.length ? (
              <ul className="divide-y divide-line">
                {world.issues.map((i) => {
                  const p = world.pledges.find((x) => x.id === i.pledgeId)!;
                  const r = world.rounds.find((x) => x.id === i.roundId)!;
                  return (
                    <li key={i.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-[15px] font-bold">
                          {p.name} · {i.type.replace("_", " ")}
                        </div>
                        <div className="text-[12px] text-ash">
                          {r.title} · {p.code} · “{i.text}”
                        </div>
                      </div>
                      {i.status === "open" ? (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="secondary" onClick={() => { act(A.resolveIssue(i.id, "refunded")); toast(`Refunded ${aud(p.amount)}`, "good"); }}>Refund</Button>
                          <Button size="sm" variant="secondary" onClick={() => { act(A.resolveIssue(i.id, "replaced")); toast("Replacement arranged", "good"); }}>Replace</Button>
                          <Button size="sm" variant="ghost" onClick={() => act(A.resolveIssue(i.id, "rejected"))}>Close</Button>
                        </div>
                      ) : (
                        <Pill tone="neutral">{i.status}</Pill>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-4 text-[12px] text-mute">No reports. Fans can report from their order page after paying.</div>
            )}
          </section>
        </div>

        <Panel title="latest activity" className="self-start">
          <EventFeed events={world.events} limit={25} showRound />
        </Panel>
      </div>
    </div>
  );
}

function ReviewActions({ r }: { r: Round }) {
  const { act, toast } = useWorld();
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {open ? (
        <>
          <Input className="!h-8 !w-56 text-[12px]" placeholder="What needs changing?" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button size="sm" variant="secondary" onClick={() => { act(A.requestChanges(r.id, note || "Please upload a printer quote.")); toast("Changes requested", "warn"); }}>Send</Button>
        </>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>Request changes</Button>
      )}
      <Button size="sm" variant="brick" onClick={() => { act(A.approveRound(r.id)); toast(`${r.title} is live`, "good"); }}>Approve</Button>
    </div>
  );
}

function ProductionActions({ r }: { r: Round }) {
  const { act, toast } = useWorld();
  const [amt, setAmt] = useState(String(r.printer.invoiceAmount ?? r.printerQuote));
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {!r.printer.invoicePaidAt ? (
        <>
          <Input className="!h-8 !w-24 text-[12px]" value={amt} onChange={(e) => setAmt(e.target.value.replace(/[^\d.]/g, ""))} />
          <Button size="sm" variant="secondary" onClick={() => { act(A.recordInvoice(r.id, Number(amt) || r.printerQuote)); toast("Invoice recorded and paid", "good"); }}>
            Pay invoice
          </Button>
        </>
      ) : (
        <span className="text-[12px] text-go">invoice {aud(r.printer.invoiceAmount!)} paid</span>
      )}
      <Button size="sm" variant="brick" onClick={() => { act(A.printerDelivered(r.id)); toast("Marked delivered to artist", "good"); }}>Delivered</Button>
    </div>
  );
}
