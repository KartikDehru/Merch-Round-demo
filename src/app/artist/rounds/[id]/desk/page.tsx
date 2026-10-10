"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useWorld } from "@/lib/store";
import { handOver } from "@/lib/actions";
import { counts } from "@/lib/domain";
import { RequireRole } from "@/components/require-role";
import { useRound } from "@/components/round-bits";
import { Halftone } from "@/components/visuals";
import { cx } from "@/components/ui";

export default function DeskPage() {
  return (
    <RequireRole role="artist">
      <Desk />
    </RequireRole>
  );
}

function Desk() {
  const { id } = useParams<{ id: string }>();
  const { round, artist } = useRound(id);
  const { world, act, toast } = useWorld();
  const [q, setQ] = useState("");
  const [scanning, setScanning] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const c = round ? counts(round, world.pledges) : null;
  const list = useMemo(() => {
    if (!c) return [];
    const all = c.all.filter((p) => ["paid", "fulfilled"].includes(p.status));
    const s = q.trim().toLowerCase();
    return all
      .filter((p) => !s || p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s))
      .sort((a, b) => Number(a.status === "fulfilled") - Number(b.status === "fulfilled") || a.name.localeCompare(b.name));
  }, [c, q]);

  if (!round || !artist || !c) return null;
  const open = ["delivered", "paid_out", "completed"].includes(round.status);
  const total = c.paid.length;
  const done = c.paid.filter((p) => p.status === "fulfilled").length;
  const left: Record<string, number> = Object.fromEntries(round.sizes.map((s) => [s, 0]));
  for (const p of c.paid) if (p.status === "paid") left[p.size] = (left[p.size] ?? 0) + 1;

  const jump = (pid: string) => {
    const p = c.all.find((x) => x.id === pid);
    if (!p) return;
    setQ(p.code);
    setFlash(p.id);
    setTimeout(() => setFlash(null), 1600);
  };

  const scan = (raw?: string) => {
    const waiting = c.paid.filter((p) => p.status === "paid" && p.fulfilment === "pickup");
    const target = raw
      ? world.pledges.find((p) => p.code.toLowerCase() === raw.trim().toLowerCase())
      : waiting[Math.floor(Math.random() * waiting.length)];
    setScanning(false);
    setCode("");
    if (!target) return toast(raw ? "No ticket with that code" : "Everyone's collected", "warn");
    if (target.roundId !== round.id) return toast("Not for this round", "bad");
    if (target.status === "fulfilled") {
      jump(target.id);
      return toast(`${target.name} already collected`, "warn");
    }
    jump(target.id);
    toast(`✓ ${target.name} · ${target.size}`, "good");
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-ink text-paper">
      <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/artist/rounds/${round.id}`} className="text-[11px] uppercase tracking-[0.16em] text-paper/60 hover:text-paper">
            ← round
          </Link>
          <span className="inline-flex items-center gap-2 border border-paper/20 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-paper/60">
            <span className="size-1.5 rounded-full bg-lime" /> saved on device · syncs when online
          </span>
        </div>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-paper/50">{artist.name} · {round.venue}</div>
            <h1 className="mt-1 font-display text-[40px] leading-none font-extrabold uppercase sm:text-[56px]">At the merch desk.</h1>
          </div>
          <div className="text-right">
            <div className="font-display text-[48px] leading-none font-extrabold tabular">
              <span className="text-lime">{done}</span>
              <span className="text-paper/40">/{total}</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-paper/50">collected</div>
          </div>
        </div>

        {!open ? (
          <div className="mt-10 border border-dashed border-paper/30 p-8 text-center text-paper/70">
            This desk opens when the merch arrives. Use the demo controls on the round page to fast-forward.
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name or code"
                className="h-14 border border-paper/25 bg-coal px-4 text-[16px] text-paper placeholder:text-paper/40 focus:border-lime focus:outline-none"
              />
              <button onClick={() => setScanning(true)} className="h-14 bg-lime px-6 font-mono text-[13px] uppercase tracking-[0.16em] text-ink active:translate-y-px">
                Scan
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
              <span className="text-paper/50 uppercase tracking-[0.14em]">left:</span>
              {Object.entries(left).map(([s, n]) => (
                <span key={s} className="border border-paper/20 px-2 py-0.5 tabular">
                  {s} <b className={n ? "text-lime" : "text-paper/40"}>{n}</b>
                </span>
              ))}
            </div>

            <ul className="mt-5 divide-y divide-paper/10 border border-paper/15">
              {list.map((p) => {
                const isDone = p.status === "fulfilled";
                return (
                  <li key={p.id} className={cx("flex items-center gap-3 px-4 py-3 transition-colors", flash === p.id && "bg-lime/20", isDone && "opacity-55")}>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-[19px] font-bold uppercase">{p.name}</div>
                      <div className="text-[12px] text-paper/50">
                        <span className="font-pixel text-[13px] text-paper/80">{p.code}</span> · {p.fulfilment === "delivery" ? "posting, not pick-up" : "pick up"}
                      </div>
                    </div>
                    <span className="flex size-12 items-center justify-center border border-paper/30 font-display text-[18px] font-extrabold">{p.size}</span>
                    {isDone ? (
                      <button onClick={() => act(handOver(p.id, true))} className="h-14 w-36 border border-paper/20 text-[11px] uppercase tracking-[0.14em] text-paper/60">
                        ✓ done · undo
                      </button>
                    ) : (
                      <button
                        disabled={p.fulfilment === "delivery"}
                        onClick={() => {
                          act(handOver(p.id));
                          toast(`Handed over to ${p.name}`, "good");
                        }}
                        className="h-14 w-36 bg-paper text-[12px] uppercase tracking-[0.14em] text-ink active:bg-lime disabled:opacity-30"
                      >
                        Handed over
                      </button>
                    )}
                  </li>
                );
              })}
              {!list.length && <li className="p-8 text-center text-paper/50">No one by that name. Try another search.</li>}
            </ul>
          </>
        )}
      </div>

      {scanning && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-ink/95 p-5" onClick={() => setScanning(false)}>
          <div className="mx-auto mt-10 w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-square overflow-hidden border-2 border-lime">
              <Halftone dark density={9} />
              <div className="absolute inset-[18%] border-2 border-dashed border-lime/80" />
              <div className="absolute inset-x-[18%] top-1/2 h-0.5 animate-pulse bg-lime" />
            </div>
            <p className="mt-3 text-center text-[12px] text-paper/60">Point the camera at the fan&apos;s QR ticket</p>
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="or type code e.g. MR-7K3Q"
                className="h-12 border border-paper/25 bg-coal px-3 text-paper placeholder:text-paper/40 focus:outline-none"
              />
              <button onClick={() => scan(code)} className="h-12 border border-paper/30 px-4 text-[12px] uppercase tracking-[0.14em] text-paper">
                Find
              </button>
            </div>
            <button onClick={() => scan()} className="mt-3 h-14 w-full bg-lime text-[13px] uppercase tracking-[0.16em] text-ink">
              Simulate a scan
            </button>
            <button onClick={() => setScanning(false)} className="mt-2 h-12 w-full text-[12px] uppercase tracking-[0.14em] text-paper/60">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
