"use client";

import Link from "next/link";
import { useWorld } from "@/lib/store";
import { counts, money } from "@/lib/domain";
import { aud, date } from "@/lib/format";
import { RequireRole } from "@/components/require-role";
import { H1, Label, RoundPill } from "@/components/ui";
import { Tally } from "@/components/visuals";

export default function AdminRounds() {
  return (
    <RequireRole role="admin">
      <Inner />
    </RequireRole>
  );
}

function Inner() {
  const { world } = useWorld();
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
      <Label>all rounds</Label>
      <H1 className="mt-3">Rounds.</H1>
      <div className="mt-8 overflow-x-auto border border-line bg-card">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead className="border-b border-line bg-haze/60">
            <tr className="label">
              <th className="px-4 py-3 font-normal">Round</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Progress</th>
              <th className="px-4 py-3 font-normal text-right">Paid</th>
              <th className="px-4 py-3 font-normal text-right">Our net</th>
              <th className="px-4 py-3 font-normal text-right">Artist</th>
              <th className="px-4 py-3 font-normal">Show</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {world.rounds.map((r) => {
              const a = world.artists.find((x) => x.id === r.artistId)!;
              const c = counts(r, world.pledges);
              const m = money(r, world.pledges);
              const pre = r.status === "live";
              return (
                <tr key={r.id} className="hover:bg-haze/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/rounds/${r.id}`} className="font-display text-[15px] font-bold hover:underline">
                      {r.title}
                    </Link>
                    <div className="text-[11px] text-mute">{a.name}</div>
                  </td>
                  <td className="px-4 py-3"><RoundPill status={r.status} /></td>
                  <td className="w-[220px] px-4 py-3">
                    <Tally pledged={pre ? c.pledgedCount : c.paidCount + c.owed.length} paid={pre ? 0 : c.paidCount} target={r.target} accent={a.accent} size="sm" />
                    <div className="mt-1 text-[11px] text-ash tabular">{pre ? c.pledgedCount : c.paidCount} / {r.target}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular">{pre ? <span className="text-mute">{aud(m.pledgedGross)} pledged</span> : aud(m.paidGross)}</td>
                  <td className="px-4 py-3 text-right tabular">{pre || r.status === "failed" ? "—" : aud(m.platformNet, { cents: true })}</td>
                  <td className="px-4 py-3 text-right tabular">{r.payout ? aud(r.payout.amount, { cents: true }) : pre || r.status === "failed" ? "—" : <span className="text-ash">{aud(m.artist, { cents: true })}</span>}</td>
                  <td className="px-4 py-3 text-ash">{date(r.showDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
