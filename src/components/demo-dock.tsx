"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useWorld } from "@/lib/store";
import { artistEmail, markRead } from "@/lib/actions";
import { ADMIN_EMAIL, DEMO_FAN } from "@/lib/domain";
import { ago } from "@/lib/format";
import type { Email } from "@/lib/types";
import { Button, Label, cx } from "./ui";
import { EventFeed } from "./event-feed";

export function useInbox() {
  const { world } = useWorld();
  const role = world.session.role;
  return useMemo(() => {
    const to =
      role === "fan" ? DEMO_FAN.email : role === "artist" ? artistEmail(world, world.session.artistId) : role === "admin" ? ADMIN_EMAIL : null;
    const emails = to ? world.emails.filter((e) => e.to === to) : [];
    return { to, emails, unread: emails.filter((e) => !e.read).length };
  }, [world, role]);
}

export function DemoDock() {
  const { world, reset, toast } = useWorld();
  const router = useRouter();
  const [sheet, setSheet] = useState<null | "inbox" | "log">(null);
  const inbox = useInbox();
  const role = world.session.role;
  const artist = world.artists.find((a) => a.id === world.session.artistId);
  const who = role === "fan" ? DEMO_FAN.name : role === "artist" ? artist?.name : role === "admin" ? "Priya · Ops" : "Not signed in";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-5 sm:pb-4">
        <div className="mx-auto flex max-w-[1240px] items-center gap-2 border border-ink bg-ink px-2 py-2 text-paper sm:gap-3 sm:px-3">
          <span className="hidden bg-brick px-2 py-1 font-display text-[13px] leading-none text-ink sm:inline">DEMO</span>
          <span className="hidden text-[11px] uppercase tracking-[0.16em] text-paper/60 md:inline">no real payments</span>
          <span className="mx-1 hidden h-5 w-px bg-paper/20 md:inline" />
          <Link href="/demo" className="flex min-w-0 items-center gap-2 px-1 text-[12px] hover:text-brick">
            <span className={cx("size-2 shrink-0 rounded-full", role ? "bg-brick" : "bg-paper/40")} />
            <span className="truncate">
              <span className="text-paper/60 uppercase tracking-[0.14em] text-[10px] mr-1.5">{role ?? "guest"}</span>
              {who}
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setSheet(sheet === "inbox" ? null : "inbox")}
              className="relative h-8 px-3 text-[11px] uppercase tracking-[0.16em] hover:bg-paper/10"
            >
              Inbox
              {inbox.unread > 0 && (
                <span className="ml-1.5 inline-flex min-w-5 justify-center bg-brick px-1 text-[10px] text-ink tabular">{inbox.unread}</span>
              )}
            </button>
            <button
              onClick={() => setSheet(sheet === "log" ? null : "log")}
              className="h-8 px-3 text-[11px] uppercase tracking-[0.16em] hover:bg-paper/10"
            >
              Activity
            </button>
            <button
              onClick={() => {
                if (confirm("Reset the demo to its starting data?")) {
                  reset();
                  toast("Demo reset", "good");
                  router.push("/");
                }
              }}
              className="h-8 px-3 text-[11px] uppercase tracking-[0.16em] text-paper/60 hover:bg-paper/10 hover:text-paper"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-[55]" onClick={() => setSheet(null)}>
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="animate-rise absolute top-0 right-0 bottom-0 flex w-full max-w-[460px] flex-col border-l border-ink bg-paper"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <Label>{sheet === "inbox" ? "inbox" : "activity log"}</Label>
                <div className="mt-1 text-[12px] text-ash">
                  {sheet === "inbox" ? (inbox.to ? `Emails sent to ${inbox.to}` : "Pick a demo account to see its emails") : "Everything that happened, newest first"}
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSheet(null)}>
                Close
              </Button>
            </header>
            <div className="flex-1 overflow-y-auto">
              {sheet === "inbox" ? <Inbox emails={inbox.emails} /> : <div className="p-5"><EventFeed events={world.events} limit={120} showRound /></div>}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function Inbox({ emails }: { emails: Email[] }) {
  const { act, world } = useWorld();
  const [openId, setOpenId] = useState<string | null>(emails[0]?.id ?? null);
  useEffect(() => {
    const unread = emails.filter((e) => !e.read).map((e) => e.id);
    if (unread.length) {
      const t = setTimeout(() => act(markRead(unread)), 900);
      return () => clearTimeout(t);
    }
  }, [emails, act]);

  if (!emails.length)
    return <div className="p-8 text-center font-display text-mute">no emails yet</div>;

  return (
    <ul>
      {emails.map((e) => {
        const r = world.rounds.find((x) => x.id === e.roundId);
        const open = openId === e.id;
        return (
          <li key={e.id} className="border-b border-line">
            <button onClick={() => setOpenId(open ? null : e.id)} className="block w-full px-5 py-3.5 text-left hover:bg-card">
              <div className="flex items-center gap-2">
                {!e.read && <span className="size-1.5 shrink-0 rounded-full bg-brick ring-1 ring-ink" />}
                <span className={cx("truncate font-display text-[15px] font-bold", !e.read && "text-ink")}>{e.subject}</span>
                <span className="ml-auto shrink-0 text-[11px] text-mute">{ago(e.at)}</span>
              </div>
              {r && <div className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-mute">{r.title}</div>}
            </button>
            {open && (
              <div className="mx-5 mb-4 border border-line bg-card p-4 text-[13px] leading-relaxed">
                <div className="mb-3 flex items-center justify-between border-b border-dashed border-line pb-2 text-[11px] text-mute">
                  <span>From: Merch Round &lt;hello@merchround.com.au&gt;</span>
                </div>
                <p>{e.body}</p>
                {e.pledgeId && (
                  <Link href={`/o/${e.pledgeId}`} className="mt-3 inline-block text-[14px] font-bold underline decoration-brick decoration-2 underline-offset-4">
                    Open order →
                  </Link>
                )}
                {!e.pledgeId && r && e.audience !== "fan" && (
                  <Link
                    href={e.audience === "admin" ? `/admin/rounds/${r.id}` : `/artist/rounds/${r.id}`}
                    className="mt-3 inline-block text-[14px] font-bold underline decoration-brick decoration-2 underline-offset-4"
                  >
                    Open round →
                  </Link>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
