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
      <section className="relative isolate h-[min(78vh,760px)] min-h-[480px] overflow-hidden bg-ink text-paper">
        <Image
          src="/photos/hero-booth.jpg"
          alt="A merch booth at a show, with shirts hanging under a neon MERCH sign"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative mx-auto flex h-full max-w-[980px] flex-col items-center justify-center gap-6 px-5 py-24 text-center sm:px-8">
          <h1 className="animate-rise font-display text-[clamp(40px,6.2vw,76px)] leading-[0.95] tracking-[-0.03em]">
            Don&apos;t gamble with your merchandise
          </h1>
          <Link href="#how" className="animate-rise text-[16px] font-medium text-paper underline underline-offset-4 [animation-delay:80ms]">
            See how a merch round works
          </Link>
          <LinkButton href="/demo" variant="brick" size="lg" className="animate-rise [animation-delay:140ms]">
            Try our demo
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
      <section id="how" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-5 py-24 sm:px-8">
          <h2 className="text-center font-display text-[clamp(32px,5vw,52px)] leading-none">How a round works.</h2>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, b], i) => (
              <div key={t} className="flex flex-col gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-brick font-display text-[16px] leading-none text-ink">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-[20px] font-bold">{t}</div>
                <p className="text-[15px] leading-[1.5] text-ash">{b}</p>
              </div>
            ))}
          </div>
          <div className="grid items-start gap-x-14 gap-y-4 border-t border-line pt-12 lg:grid-cols-2">
            <h3 className="font-display text-[clamp(28px,4vw,40px)] leading-none">And what if it falls short?</h3>
            <p className="text-[17px] leading-[1.5] text-ash">
              Nobody pays, nothing gets printed, and you&apos;ve learned something before spending anything. A round that doesn&apos;t make it still
              keeps a pile of unsold merch out of landfill.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── take-home calculator ───────── */}
      <section id="artists" className="scroll-mt-20">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-[clamp(32px,5vw,52px)] leading-none">OK, so how does the money work?</h2>
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

      {/* ───────── what we stand for ───────── */}
      <section id="care" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative aspect-square bg-stone">
            <Image
              src="/photos/values-tee.jpg"
              alt="Black tee printed with there's a better, greener, simpler way"
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 90vw, 560px"
            />
          </div>
          <div>
            <h2 className="font-display text-[clamp(32px,5vw,52px)] leading-none">What we stand for.</h2>
            <div className="mt-8 flex flex-col border-b border-line">
              {VALUES.map(([t, b]) => (
                <div key={t} className="flex flex-col gap-2 border-t border-line py-5">
                  <div className="text-[18px] font-bold">{t}</div>
                  <p className="text-[15px] leading-[1.5] text-ash">{b}</p>
                </div>
              ))}
            </div>
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
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone">
            <Image
              src="/photos/crowd.jpg"
              alt="A crowd waiting behind barriers at an outdoor show"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 640px"
            />
          </div>
          <div className="flex flex-col items-start gap-6">
            <h2 className="font-display text-[clamp(36px,5vw,56px)] leading-[0.95]">Let&apos;s do a Merch Round.</h2>
            <p className="max-w-[460px] text-[17px] leading-[1.5] text-ash">
              Got a release coming up? Start a round and see what your fans ask for. If it goes well, run another next time.
            </p>
            <LinkButton href="/demo" variant="brick" size="lg">
              Open a Merch Round
            </LinkButton>
          </div>
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
