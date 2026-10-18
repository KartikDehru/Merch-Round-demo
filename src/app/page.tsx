"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import { FEE_RATE, suggestTarget } from "@/lib/domain";
import { aud } from "@/lib/format";
import { Receipt, RoundCard } from "@/components/round-bits";
import { Input, LinkButton } from "@/components/ui";
import { Footer } from "@/components/footer";
import { DemoAccounts } from "@/components/demo-accounts";

const STEPS = [
  ["Open a round", "Choose how long it runs. It has a start and a finish, and when the next release is ready you can come back and run another."],
  ["Fans buy", "Your fans see the price up front and can check out in a few seconds. No pre-order forms, no chasing people in your DMs."],
  ["Hit the number", "Once enough people have bought to make the run worthwhile, it goes ahead. You still pick your own designer and printer."],
  ["Collect it at the show", "Fans pick it up on the night, or have it sent to them if they can't make it."],
];

const VALUES = [
  ["Accessibility", "Fans see the price early, check out in a few seconds, and either collect it at the show or have it delivered."],
  ["Sustainability", "Artists only make what's been asked for, so there's no heap of unsold shirts heading for landfill."],
  ["Community", "Artists and fans do this together. When the community reaches the number, the run gets made."],
  ["Empowerment", "Pick your own designer and your own printer, the way the DIY scene always has."],
  ["Partnership", "We do well when you do. Even a round that falls short keeps something out of landfill."],
];

export default function Home() {
  const { world } = useWorld();
  const live = world.rounds.filter((r) => r.status === "live");

  return (
    <div>
      {/* ───────── hero ───────── */}
      <section className="relative isolate min-h-[78vh] overflow-hidden bg-ink text-paper">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink/70" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-[900px] flex-col items-center justify-center gap-7 px-5 py-28 text-center sm:px-8">
          <h1 className="animate-rise font-display text-[clamp(40px,7vw,80px)] leading-[0.95] tracking-[-0.03em]">
            Don&apos;t gamble with your merchandise
          </h1>
          <Link href="#how" className="animate-rise text-[16px] font-medium text-paper underline underline-offset-4 [animation-delay:80ms]">
            See how a merch round works
          </Link>
          <LinkButton href="/demo" variant="brick" size="lg" className="animate-rise [animation-delay:140ms]">
            Try Our Demo
          </LinkButton>
        </div>
      </section>

      {/* ───────── better way ───────── */}
      <section className="mx-auto max-w-[720px] px-5 py-24 text-center sm:px-8">
        <h2 className="font-display text-[clamp(28px,4vw,40px)] leading-none">There&apos;s a better way</h2>
        <p className="mt-6 text-[18px] leading-[1.55] text-ash sm:text-[20px]">
          Merch Round is a marketplace for live music.
          <br />
          Fans can buy the merchandise before the show,
          <br />
          Artists make only what&apos;s needed.
        </p>
      </section>

      {/* ───────── open now ───────── */}
      <section className="mx-auto max-w-[1280px] px-5 pb-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label">Made possible by fans</div>
            <h2 className="mt-2 font-display text-[clamp(32px,5vw,52px)] leading-none">Open right now.</h2>
          </div>
          <LinkButton href="/rounds" variant="secondary" size="sm">
            All rounds
          </LinkButton>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {live.slice(0, 3).map((r, i) => (
            <RoundCard key={r.id} round={r} artist={world.artists.find((a) => a.id === r.artistId)!} href={`/r/${r.slug}`} index={i} />
          ))}
        </div>
      </section>

      {/* ───────── how a round works ───────── */}
      <section id="how" className="scroll-mt-20 border-t border-line bg-stone">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-5 py-24 sm:px-8">
          <h2 className="text-center font-display text-[clamp(32px,5vw,52px)] leading-none">How a round works</h2>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, b], i) => (
              <div key={t} className="flex flex-col gap-3">
                <div className="font-display text-[40px] leading-none text-mute">{String(i + 1).padStart(2, "0")}</div>
                <div className="text-[20px] font-bold">{t}</div>
                <p className="text-[15px] leading-[1.5] text-ash">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── falls short ───────── */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-[1280px] items-end gap-x-14 gap-y-8 px-5 py-22 sm:px-8 lg:grid-cols-2">
          <h2 className="font-display text-[clamp(36px,5vw,64px)] leading-[0.95]">And if it falls short, that&apos;s alright.</h2>
          <p className="text-[18px] leading-[1.45] text-cloud sm:text-[20px]">
            Nobody pays, nothing gets printed, and you&apos;ve learned something before spending anything. A round that doesn&apos;t make it still
            keeps a pile of unsold merch out of landfill.
          </p>
        </div>
      </section>

      {/* ───────── take-home calculator ───────── */}
      <section id="artists" className="scroll-mt-20">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-[clamp(32px,5vw,52px)] leading-none">What you take home</h2>
            <p className="max-w-[500px] text-[18px] leading-[1.5] text-ash">
              Put in your printer&apos;s quote and your price. We suggest how many fans you need, with a little room for the odd declined card.
            </p>
            <p className="max-w-[500px] text-[16px] leading-[1.5] text-mute">
              Fans pay the price you set and nothing more. Merch Round keeps 10%, which also covers card fees. The printer is paid from the round,
              and the rest is yours.
            </p>
          </div>
          <Calculator />
        </div>
      </section>

      {/* ───────── what we care about ───────── */}
      <section id="care" className="scroll-mt-20 border-t border-line bg-stone">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-5 py-24 sm:px-8">
          <h2 className="font-display text-[clamp(32px,5vw,52px)] leading-none">What we care about</h2>
          <div className="flex flex-col border-b border-ink">
            {VALUES.map(([t, b]) => (
              <div key={t} className="flex flex-wrap gap-x-12 gap-y-3 border-t border-ink py-7">
                <div className="flex-[1_1_240px] text-[22px] font-bold">{t}</div>
                <p className="flex-[2_1_380px] text-[16px] leading-[1.5] text-ash sm:text-[17px]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── demo accounts ───────── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8">
          <h2 className="font-display text-[clamp(32px,5vw,52px)] leading-none">All sides.</h2>
          <p className="mt-5 max-w-[640px] text-[18px] leading-[1.5] text-ash">
            Buy as a fan, run a round as an artist, and approve, print and pay out as the Merch Round team. Nothing here is real money.
          </p>
          <DemoAccounts />
        </div>
      </section>

      {/* ───────── call to action ───────── */}
      <section className="bg-brick text-ink">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-8 px-5 py-24 sm:px-8">
          <h2 className="font-display text-[clamp(40px,7vw,80px)] leading-[0.95]">
            Let&apos;s do a
            <br />
            Merch Round.
          </h2>
          <p className="max-w-[560px] text-[18px] leading-[1.45]">
            Got a release coming up? Start a round and see what your fans ask for. If it goes well, run another next time.
          </p>
          <Link href="/demo" className="inline-flex min-h-14 items-center bg-ink px-8 text-[16px] font-bold text-paper transition hover:bg-coal">
            Open a Merch Round
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Calculator() {
  const [price, setPrice] = useState(45);
  const [quote, setQuote] = useState(650);
  const [minRun, setMinRun] = useState(25);
  const target = suggestTarget(quote, minRun, price);
  const gross = target * price;
  const fee = gross * FEE_RATE;
  const take = gross - fee - quote;
  const num = (v: string) => Math.max(0, Number(v.replace(/[^0-9.]/g, "")) || 0);
  return (
    <div className="border border-line bg-stone p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {(
          [
            ["Price (A$)", price, setPrice],
            ["Printer quote (A$)", quote, setQuote],
            ["Printer's minimum", minRun, setMinRun],
          ] as const
        ).map(([l, v, set]) => (
          <label key={l} className="block">
            <span className="mb-1.5 block text-[11px] tracking-[0.12em] text-ash uppercase">{l}</span>
            <Input inputMode="numeric" value={String(v)} onChange={(e) => set(num(e.target.value))} className="bg-paper" />
          </label>
        ))}
      </div>
      <div className="mt-8 flex items-end justify-between border-y border-line py-5">
        <div>
          <div className="text-[11px] tracking-[0.12em] text-ash uppercase">Fans needed</div>
          <div className="font-display text-[64px] leading-none tabular">{target}</div>
        </div>
        <div className="text-right text-[14px] text-ash">
          at {aud(price)} each
          <br />
          over 14 days
        </div>
      </div>
      <Receipt
        className="mt-5"
        rows={[
          { label: `Fans pay (${target} × ${aud(price)})`, value: aud(gross, { cents: true }) },
          { label: "Merch Round (10%, card fees included)", value: `−${aud(fee, { cents: true })}` },
          { label: "Printer", value: `−${aud(quote, { cents: true })}` },
        ]}
        total={{ label: "You take home", value: <span className="bg-brick px-2 py-1">{aud(Math.max(0, take), { cents: true })}</span> }}
      />
      <p className="mt-4 text-[13px] text-ash">Every fan past the number adds {aud(price * 0.9, { cents: true })} to your share.</p>
    </div>
  );
}
