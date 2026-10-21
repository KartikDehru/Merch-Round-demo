"use client";

import Link from "next/link";
import { useWorld } from "@/lib/store";
import { connectStripe } from "@/lib/actions";
import { counts, money, projectedAtTarget } from "@/lib/domain";
import { aud, date } from "@/lib/format";
import { RequireRole } from "@/components/require-role";
import { MerchMock, Tally, Countdown } from "@/components/visuals";
import { Button, Empty, H1, Label, LinkButton, RoundPill, Stat } from "@/components/ui";

export default function ArtistDashboard() {
  return (
    <RequireRole role="artist">
      <Dashboard />
    </RequireRole>
  );
}

function Dashboard() {
  const { world, act, toast, now } = useWorld();
  const artist = world.artists.find((a) => a.id === world.session.artistId)!;
  const rounds = world.rounds.filter((r) => r.artistId === artist.id);
  const paidOut = rounds.reduce((s, r) => s + (r.payout?.amount ?? 0), 0);
  const fans = rounds.reduce((s, r) => s + counts(r, world.pledges).pledgedCount, 0);
  const live = rounds.filter((r) => r.status === "live");

  const todo = rounds.flatMap((r) => {
    if (r.status === "awaiting_decision") return [{ r, text: `Decide: cover ${aud(r.shortfall ?? 0, { cents: true })} or cancel`, cta: "Decide", urgent: true }];
    if (r.status === "delivered") return [{ r, text: "Merch arrived. Check it and confirm to get paid.", cta: "Confirm", urgent: true }];
    if (r.status === "draft" && r.reviewNote) return [{ r, text: `Changes requested: ${r.reviewNote}`, cta: "Fix", urgent: true }];
    if (r.status === "paid_out") return [{ r, text: `Show on ${date(r.showDate)}. Open the merch desk on the night.`, cta: "Desk", urgent: false }];
    return [];
  });

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="size-12 border-2 border-ink" style={{ background: artist.accent }} />
          <div>
            <Label>artist dashboard · {artist.city}</Label>
            <H1 className="mt-1 !text-[36px] sm:!text-[48px]">{artist.name}</H1>
          </div>
        </div>
        <LinkButton href="/artist/new" variant="brick" size="lg">
          + New round
        </LinkButton>
      </div>

      {artist.stripe !== "verified" && (
        <div className="mt-8 flex flex-wrap items-center gap-4 border-2 border-hold bg-hold-soft p-4">
          <span className="font-display text-2xl text-hold">!</span>
          <div className="flex-1">
            <div className="font-display text-[17px] font-bold">Finish Stripe setup to publish rounds</div>
            <div className="text-[13px] text-ash">Stripe verifies your ID and bank account so we can pay you.</div>
          </div>
          <Button onClick={() => { act(connectStripe(artist.id)); toast("Stripe verified", "good"); }}>Continue to Stripe</Button>
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat className="bg-stone p-5" label="live rounds" value={live.length} sub={live[0] ? `next closes ${date(live[0].closesAt)}` : "none open"} />
        <Stat className="bg-stone p-5" label="fans in now" value={fans} sub="across active rounds" />
        <Stat className="bg-stone p-5" label="paid out" value={aud(paidOut)} sub="all time, via Stripe" />
        <Stat className="bg-stone p-5" label="stripe" value={artist.stripe === "verified" ? "✓" : "—"} sub={artist.stripe === "verified" ? "payouts enabled" : "setup needed"} />
      </div>

      {todo.length > 0 && (
        <section className="mt-10">
          <Label>to do</Label>
          <div className="mt-3 divide-y divide-line border border-line bg-note/40">
            {todo.map(({ r, text, cta }) => (
              <Link key={r.id} href={cta === "Desk" ? `/artist/rounds/${r.id}/desk` : `/artist/rounds/${r.id}`} className="flex items-center gap-4 p-4 hover:bg-note/70">
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-bold">{r.title}</span>
                  <span className="block text-[13px] text-ash">{text}</span>
                </span>
                <span className="border border-ink bg-paper px-3 py-1.5 text-[13px] font-bold">{cta} →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <Label>your rounds</Label>
        <div className="mt-3 divide-y divide-line border-y border-line">
          {rounds.map((r) => {
            const c = counts(r, world.pledges);
            const m = money(r, world.pledges);
            const proj = projectedAtTarget(r);
            const pre = r.status === "live";
            return (
              <Link
                key={r.id}
                href={`/artist/rounds/${r.id}`}
                className="group grid gap-5 bg-card py-5 transition hover:bg-stone/60 sm:grid-cols-[96px_1fr_auto] sm:items-center"
              >
                <div className="hidden size-24 border border-line dotgrid sm:block">
                  <MerchMock product={r.product} colorway={r.colorway} motif={r.motif} accent={artist.accent} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-[20px] font-bold">{r.title}</span>
                    <RoundPill status={r.status} />
                  </div>
                  <div className="mt-1 text-[12px] text-ash">
                    {aud(r.price)} · target {r.target} · {r.venue} · {date(r.showDate)}
                  </div>
                  <Tally
                    pledged={pre ? c.pledgedCount : c.paidCount + c.owed.length}
                    paid={pre ? 0 : c.paidCount}
                    target={r.target}
                    accent={artist.accent}
                    size="sm"
                    className="mt-3 max-w-[560px]"
                  />
                </div>
                <div className="flex gap-6 sm:flex-col sm:items-end sm:gap-1 sm:text-right">
                  <div>
                    <div className="label">{pre ? `${c.pledgedCount} of ${r.target} asked for` : `${c.paidCount} paid`}</div>
                    {pre && <Countdown to={r.closesAt} now={now} className="text-[13px]" />}
                  </div>
                  <div>
                    <div className="label">{r.payout ? "paid to you" : pre ? "at target you get" : "your share"}</div>
                    <div className="font-display text-[22px] font-bold tabular">
                      {aud(r.payout?.amount ?? (pre || ["draft", "pending_review"].includes(r.status) ? proj.artist : m.artist), { cents: true })}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {!rounds.length && <Empty title="no rounds yet">Start your first one.</Empty>}
        </div>
      </section>
    </div>
  );
}
