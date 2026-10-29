"use client";

import Image from "next/image";
import { ARTIST_SLIDES, CARD_NOTE, FAILED_ROUND_EMAIL, FAN_SLIDES, SHOW_ROUND } from "@/lib/copy";
import { aud } from "@/lib/demo-math";

/** Compact phone-sized previews used on the landing carousels. */

export function ArtistSlide({ index }: { index: number }) {
  const title = ARTIST_SLIDES[index] ?? ARTIST_SLIDES[0];
  if (index === 0) {
    return (
      <SlideShell eyebrow="1 · Start" title="Start your first round">
        <p className="text-[11px] leading-snug text-ash">Upload a mock-up, set your number, and share a link. No dashboard.</p>
        <div className="mt-3 rounded-[4px] bg-brick px-3 py-2 text-center text-[12px] font-bold text-ink">Start</div>
      </SlideShell>
    );
  }
  if (index === 1) {
    return (
      <SlideShell eyebrow="2 · Numbers" title="Set your number">
        <Row label="Price" value="A$55" />
        <Row label="Fans needed" value="25" />
        <Row label="Printer quote" value="A$900" />
        <div className="mt-2 rounded-[4px] border border-line bg-paper p-2 text-[10px]">
          You take home <b>{aud(337.5)}</b>
        </div>
      </SlideShell>
    );
  }
  if (index === 2) {
    return (
      <SlideShell eyebrow="3 · Live" title="Share it">
        <p className="truncate rounded-[4px] border border-line bg-paper px-2 py-1.5 text-[10px]">merchround.com/r/demo-tee</p>
        <p className="mt-2 text-[20px] font-bold tabular">17 / 25</p>
        <p className="text-[10px] text-ash">4 days left</p>
      </SlideShell>
    );
  }
  if (index === 3) {
    return (
      <SlideShell eyebrow="4 · Hit" title="Hit the number">
        <p className="text-[11px] text-ash">25 of 25. Cards charged on close.</p>
        <div className="mt-3 rounded-[4px] bg-ink px-3 py-2 text-center text-[11px] font-bold text-paper">Approve the order</div>
      </SlideShell>
    );
  }
  return (
    <SlideShell eyebrow="5 · Paid" title="Get paid">
      <p className="text-[11px] text-ash">Printer paid. Your share releases when they confirm the items are finished.</p>
      <p className="mt-3 font-display text-[22px] text-brick">{aud(337.5)}</p>
      <p className="sr-only">{title}</p>
    </SlideShell>
  );
}

export function FanSlide({ index }: { index: number }) {
  const title = FAN_SLIDES[index] ?? FAN_SLIDES[0];
  if (index === 0) {
    return (
      <SlideShell eyebrow="1 · Round" title={SHOW_ROUND.title}>
        <div className="relative mb-2 aspect-square overflow-hidden rounded-[4px] bg-line">
          <Image src="/merch/tee.jpg" alt="" fill className="object-cover" sizes="200px" />
        </div>
        <Row label="Price" value={SHOW_ROUND.price} />
        <p className="mt-1 text-[10px] text-ash">17 / 25 · {SHOW_ROUND.timeLeft}</p>
      </SlideShell>
    );
  }
  if (index === 1) {
    return (
      <SlideShell eyebrow="2 · Card" title="Save your card">
        <p className="text-[9px] leading-snug text-ash">{CARD_NOTE}</p>
        <div className="mt-2 space-y-1.5">
          <FakeInput>4242 ····</FakeInput>
          <FakeInput>12 / 29</FakeInput>
        </div>
      </SlideShell>
    );
  }
  if (index === 2) {
    return (
      <SlideShell eyebrow="3 · In" title="You're in">
        <p className="text-[11px] text-ash">Nothing charged yet. We&apos;ll email you when the round closes.</p>
        <div className="mt-3 text-[18px] font-bold">18 / 25</div>
      </SlideShell>
    );
  }
  if (index === 3) {
    return (
      <SlideShell eyebrow="4 · Hit" title="It hit">
        <p className="text-[11px] text-ash">Your card was charged {SHOW_ROUND.price}. Pickup at the show.</p>
      </SlideShell>
    );
  }
  if (index === 4) {
    return (
      <SlideShell eyebrow="5 · Pickup" title="Pickup code">
        <div className="mx-auto mt-1 flex size-20 items-center justify-center border-2 border-ink bg-paper font-mono text-[10px]">
          QR
        </div>
        <p className="mt-2 text-center font-mono text-[12px] font-bold tracking-widest">MR 4821</p>
        <p className="sr-only">{title}</p>
      </SlideShell>
    );
  }
  return (
    <SlideShell eyebrow="6 · Miss" title="Not this time">
      <p className="text-[9px] leading-snug text-ash">{FAILED_ROUND_EMAIL}</p>
    </SlideShell>
  );
}

function SlideShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col p-3 text-ink">
      <div className="label text-[9px] tracking-[0.14em]">{eyebrow}</div>
      <h4 className="mt-1 font-display text-[15px] leading-tight">{title}</h4>
      <div className="mt-2 min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-1 text-[11px]">
      <span className="text-ash">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function FakeInput({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[4px] border border-line bg-paper px-2 py-1.5 text-[10px] text-mute">{children}</div>;
}
