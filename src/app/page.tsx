"use client";

import Link from "next/link";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import { FEE_RATE, counts, suggestTarget } from "@/lib/domain";
import { aud, date } from "@/lib/format";
import { Ring, TeeGlyph } from "@/components/visuals";
import { Receipt, RoundCard } from "@/components/round-bits";
import { Input, LinkButton } from "@/components/ui";
import { Footer } from "@/components/footer";
import { DemoAccounts } from "@/components/demo-accounts";

const STEPS = [
  ["Open a round", "Choose how long it runs. It has a start and a finish, and when the next release is ready you can come back and run another."],
  ["Fans buy", "Your fans see the price up front and can check out in a few seconds. No pre-order forms, no chasing people in your DMs."],
  ["Hit the number", "Once enough people have bought to make the run worthwhile, it goes ahead. You still pick your own designer and printer, and we're around if you'd like a hand."],
  ["Collect it at the show", "Fans pick it up on the night, or have it sent to them if they can't make it."],
];

const VALUES = [
  ["Accessibility", "Fans see the price early, check out in a few seconds, and either collect it at the show or have it delivered."],
  ["Sustainability", "Artists only make what's been asked for, so there's no heap of unsold shirts heading for landfill."],
  ["Community", "Artists and fans do this together. When the community reaches the number, the run gets made."],
  ["Empowerment", "Pick your own designer and your own printer, the way the DIY scene always has. We'll help whenever you'd like us to."],
  ["Partnership", "We do well when you do. Even a round that falls short keeps something out of landfill."],
];

export default function Home() {
  const { world } = useWorld();
  const live = world.rounds.filter((r) => r.status === "live");
  const sample = [...live].sort((a, b) => counts(b, world.pledges).pledgedCount / b.target - counts(a, world.pledges).pledgedCount / a.target)[0];

  return (
    <div>
      {/* ───────── hero ───────── */}
      <section className="relative overflow-hidden">
        <Ring className="absolute -top-16 -right-60 hidden w-[900px] text-stone md:block" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 px-5 pt-14 pb-24 sm:px-8 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <h1 className="font-display text-[52px] leading-[0.98] sm:text-[clamp(52px,6.6vw,96px)]">
              Find out who wants the shirt <span className="text-brick">before</span> you pay for it.
            </h1>
            <p className="max-w-[520px] text-[20px] leading-[1.4] sm:text-[22px]">
              Open a Merch Round and let your fans tell you what&apos;s worth making. If enough of them buy, it gets printed. If they don&apos;t,
              nobody&apos;s out of pocket and there&apos;s no box of unsold shirts left in the van.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <LinkButton href="/demo" variant="brick" size="lg">
                Try the demo
              </LinkButton>
              <Link href="#how" className="text-[18px] font-medium underline">
                See how a round works
              </Link>
            </div>
          </div>

          <div className="flex justify-center p-4">{sample && <SampleTicket roundId={sample.id} />}</div>
        </div>
      </section>

      {/* ───────── how a round goes ───────── */}
      <section id="how" className="scroll-mt-20 bg-ink text-paper">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-5 py-24 sm:px-8">
          <h2 className="font-display text-[44px] leading-none sm:text-[clamp(44px,6vw,80px)]">How a round goes</h2>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, b], i) => (
              <div key={t} className="flex flex-col gap-3 border-t-[3px] border-paper pt-5">
                <div className="font-display text-[56px] leading-none text-brick-light">{String(i + 1).padStart(2, "0")}</div>
                <div className="text-[24px] font-bold">{t}</div>
                <p className="text-[18px] leading-[1.45] text-cloud">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── falls short ───────── */}
      <section className="bg-teal text-paper">
        <div className="mx-auto grid max-w-[1280px] items-end gap-x-14 gap-y-8 px-5 py-22 sm:px-8 lg:grid-cols-2">
          <h2 className="font-display text-[52px] leading-[0.95] sm:text-[clamp(52px,7vw,100px)]">And if it falls short, that&apos;s alright.</h2>
          <p className="text-[22px] leading-[1.4] font-medium sm:text-[24px]">
            Nobody pays, nothing gets printed, and you&apos;ve learned something before spending anything. A round that doesn&apos;t make it still
            keeps a pile of unsold merch out of landfill.
          </p>
        </div>
      </section>

      {/* ───────── open now ───────── */}
      <section className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[44px] leading-none sm:text-[clamp(44px,6vw,80px)]">Open right now</h2>
          <LinkButton href="/rounds" variant="secondary">
            All rounds
          </LinkButton>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {live.slice(0, 3).map((r, i) => (
            <RoundCard key={r.id} round={r} artist={world.artists.find((a) => a.id === r.artistId)!} href={`/r/${r.slug}`} index={i} />
          ))}
        </div>
      </section>

      {/* ───────── take-home calculator ───────── */}
      <section id="artists" className="scroll-mt-20 bg-stone">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-[44px] leading-none sm:text-[clamp(44px,6vw,80px)]">What you take home</h2>
            <p className="max-w-[500px] text-[20px] leading-[1.45]">
              Put in your printer&apos;s quote and your price. We suggest how many fans you need, with a little room for the odd declined card.
            </p>
            <p className="max-w-[500px] text-[18px] leading-[1.45] text-ash">
              Fans pay the price you set and nothing more. Merch Round keeps 10%, which also covers card fees. The printer is paid from the round,
              and the rest is yours.
            </p>
          </div>
          <Calculator />
        </div>
      </section>

      {/* ───────── what we care about ───────── */}
      <section id="care" className="scroll-mt-20">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-5 py-24 sm:px-8">
          <h2 className="font-display text-[44px] leading-none sm:text-[clamp(44px,6vw,80px)]">What we care about</h2>
          <div className="flex flex-col border-b-[3px] border-ink">
            {VALUES.map(([t, b]) => (
              <div key={t} className="flex flex-wrap gap-x-12 gap-y-3 border-t-[3px] border-ink py-7">
                <div className="flex-[1_1_280px] font-display text-[36px] leading-none sm:text-[44px]">{t}</div>
                <p className="flex-[2_1_380px] text-[19px] leading-[1.45] sm:text-[20px]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── demo accounts ───────── */}
      <section className="border-t-[3px] border-ink">
        <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8">
          <h2 className="font-display text-[44px] leading-none sm:text-[clamp(44px,6vw,80px)]">Have a go</h2>
          <p className="mt-5 max-w-[640px] text-[20px] leading-[1.45]">
            Three demo accounts and a full round, all running in your browser. Buy as a fan, run a round as an artist, and approve, print and pay
            out as the Merch Round team. Nothing here is real money.
          </p>
          <DemoAccounts />
        </div>
      </section>

      {/* ───────── call to action ───────── */}
      <section className="bg-brick text-paper">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-8 px-5 py-24 sm:px-8">
          <h2 className="font-display text-[52px] leading-[0.95] sm:text-[clamp(52px,8vw,116px)]">
            Let&apos;s do a
            <br />
            Merch Round.
          </h2>
          <p className="max-w-[560px] text-[22px] leading-[1.4]">
            Got a release coming up? Start a round and see what your fans ask for. If it goes well, run another next time.
          </p>
          <Link href="/demo" className="inline-flex min-h-14 items-center bg-paper px-8 text-[19px] font-bold text-ink transition hover:bg-stone">
            Open a Merch Round
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SampleTicket({ roundId }: { roundId: string }) {
  const { world } = useWorld();
  const round = world.rounds.find((r) => r.id === roundId)!;
  const artist = world.artists.find((a) => a.id === round.artistId)!;
  const c = counts(round, world.pledges);
  return (
    <Link href={`/r/${round.slug}`} className="block w-full max-w-[400px] -rotate-3 bg-ink text-paper transition duration-300 hover:-rotate-1">
      <div className="flex flex-col gap-4 px-6 pt-6 pb-5">
        <div className="flex items-baseline justify-between text-[13px] tracking-[0.14em] text-fog uppercase">
          <span>Live round</span>
          <span>Open</span>
        </div>
        <div className="flex h-[220px] items-center justify-center bg-brick text-paper">
          <TeeGlyph size={150} />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="font-display text-[34px] leading-[1.05]">{artist.name}</div>
          <div className="text-[17px] text-fog">
            {round.title} · {aud(round.price)}
          </div>
        </div>
      </div>
      <div className="relative mx-3.5 h-0.5 ticket-edge text-paper">
        <span className="absolute -top-3 -left-[26px] size-6 rounded-full bg-paper" />
        <span className="absolute -top-3 -right-[26px] size-6 rounded-full bg-paper" />
      </div>
      <div className="flex flex-col gap-3.5 px-6 pt-5 pb-6">
        <div className="flex justify-between text-[17px] font-bold tabular">
          <span>{c.pledgedCount} asked for</span>
          <span className="font-medium text-fog">{round.target} needed</span>
        </div>
        <div className="h-3.5 bg-track">
          <div className="h-full bg-brick" style={{ width: `${Math.min(100, (c.pledgedCount / round.target) * 100)}%` }} />
        </div>
        <div className="text-[15px] text-fog">
          Closes {date(round.closesAt)} · Pick up at the show
        </div>
      </div>
    </Link>
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
    <div className="bg-ink p-6 text-paper sm:p-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {(
          [
            ["Price (A$)", price, setPrice],
            ["Printer quote (A$)", quote, setQuote],
            ["Printer's minimum", minRun, setMinRun],
          ] as const
        ).map(([l, v, set]) => (
          <label key={l} className="block">
            <span className="mb-1.5 block text-[12px] tracking-[0.14em] text-fog uppercase">{l}</span>
            <Input inputMode="numeric" value={String(v)} onChange={(e) => set(num(e.target.value))} className="border-paper/25 bg-coal text-paper focus:border-paper" />
          </label>
        ))}
      </div>
      <div className="mt-8 flex items-end justify-between border-y-2 border-paper/20 py-5">
        <div>
          <div className="text-[12px] tracking-[0.14em] text-fog uppercase">Fans needed</div>
          <div className="font-display text-[72px] leading-none text-brick-light tabular">{target}</div>
        </div>
        <div className="text-right text-[15px] text-fog">
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
        total={{ label: "You take home", value: <span className="text-brick-light">{aud(Math.max(0, take), { cents: true })}</span> }}
      />
      <p className="mt-4 text-[14px] text-fog">Every fan past the number adds {aud(price * 0.9, { cents: true })} to your share.</p>
    </div>
  );
}
