"use client";

import Link from "next/link";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import { FEE_RATE, suggestTarget } from "@/lib/domain";
import { aud } from "@/lib/format";
import { Halftone, Logo, MerchMock, Tally } from "@/components/visuals";
import { Receipt, RoundCard } from "@/components/round-bits";
import { Cell, H2, H3, Input, Label, LinkButton, PixelNum, Stamp } from "@/components/ui";
import { Footer } from "@/components/footer";
import { DemoAccounts } from "@/components/demo-accounts";

export default function Home() {
  const { world } = useWorld();
  const live = world.rounds.filter((r) => r.status === "live");

  return (
    <div>
      {/* ───────── hero ───────── */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-y-0 right-0 w-full opacity-80 md:w-[62%]">
          <Halftone />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-transparent md:via-paper/40" />
        <div className="relative mx-auto max-w-[1240px] px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
          <Logo cursor className="text-[18px]" />
          <h1 className="mt-6 max-w-[760px] font-display text-[52px] leading-[0.9] font-bold tracking-tight uppercase sm:text-[88px]">
            Know before
            <br />
            you print.<span className="animate-blink ml-1 inline-block h-[0.8em] w-[3px] translate-y-[0.06em] bg-ink align-baseline" />
          </h1>
          <p className="mt-7 max-w-[560px] text-[15px] leading-relaxed text-ash sm:text-[17px]">
            Artists set the number that makes a print run worth it. Fans pledge with a saved card. Hit the number and it gets made. Miss it
            and nobody pays.
          </p>
          <Link
            href="/demo"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-ink/40 bg-paper/70 px-5 py-2.5 text-[13px] backdrop-blur transition hover:border-ink"
          >
            <span className="text-go">◇</span> interactive demo · fan, artist & admin accounts <span>↗</span>
          </Link>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/rounds" size="lg">
              Browse live rounds
            </LinkButton>
            <LinkButton href="/demo" size="lg" variant="lime">
              Try the demo
            </LinkButton>
          </div>
          <div className="mt-14">
            <Label>built on</Label>
            <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 font-pixel text-[22px] text-ink/70">
              <span>stripe</span>
              <span>supabase</span>
              <span>next.js</span>
              <span>resend</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── how it works ───────── */}
      <section id="how" className="mx-auto max-w-[1240px] scroll-mt-20 px-5 py-20 sm:px-8">
        <Label>how a round works</Label>
        <H2 className="mt-3 max-w-[640px]">Reach it and it gets made. Miss it and nobody pays.</H2>
        <div className="mt-10 grid border-t border-l border-line md:grid-cols-2">
          <Step n="01" tag="set" title="Set your number." body="Enter the printer's quote, minimum run, price and show date. We suggest the number of fans you need and the latest safe close date.">
            <div className="flex h-full flex-col justify-center gap-2 px-6 font-mono text-[12px] text-paper/80">
              {[
                ["printer quote", "A$650"],
                ["min run", "25"],
                ["price", "A$45"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-dashed border-paper/20 pb-1">
                  <span className="uppercase tracking-[0.14em] text-paper/50">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
              <div className="mt-2 flex items-end justify-between">
                <span className="uppercase tracking-[0.14em] text-lime">target</span>
                <span className="font-display text-[40px] leading-none font-bold text-lime">25</span>
              </div>
            </div>
          </Step>
          <Step n="02" tag="pledge" title="Fans pledge. Nobody pays yet.">
            <div className="flex h-full flex-col justify-center px-6">
              <Tally pledged={17} target={25} accent="#9ad84a" />
              <div className="mt-3 flex justify-between font-mono text-[12px] text-paper/70">
                <span>17 of 25 fans</span>
                <span>6d 04h left</span>
              </div>
            </div>
          </Step>
          <Step n="03" tag="charge" title="Hit it, and every card is charged." body="Declined cards are retried for 72 hours. Banks that want a yes get a link. If it ends up short, the artist covers the gap or cancels and everyone is refunded.">
            <div className="flex h-full items-center justify-center gap-3 px-4">
              <Stamp tone="lime" rot={-6}>It&apos;s happening</Stamp>
            </div>
          </Step>
          <Step n="04" tag="hand over" title="We pay the printer. You hand it over." body="We pay the printer's invoice from the round. When the merch arrives, the artist confirms and gets paid. Fans show a QR ticket at the desk.">
            <div className="flex h-full items-center justify-center">
              <div className="flex items-center gap-3 border border-paper/30 bg-ink/60 px-4 py-3">
                <span className="font-pixel text-[18px] text-lime">MR-7K3Q</span>
                <span className="h-6 w-px bg-paper/30" />
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/70">handed over ✓</span>
              </div>
            </div>
          </Step>
        </div>
      </section>

      {/* ───────── live rounds ───────── */}
      <section className="border-y border-line bg-card/50">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label>live now</Label>
              <H2 className="mt-3">Rounds filling up.</H2>
            </div>
            <LinkButton href="/rounds" variant="secondary">
              All rounds →
            </LinkButton>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {live.slice(0, 3).map((r, i) => (
              <RoundCard key={r.id} round={r} artist={world.artists.find((a) => a.id === r.artistId)!} href={`/r/${r.slug}`} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── why ───────── */}
      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        <Label>why it exists</Label>
        <H2 className="mt-3 max-w-[720px]">The problems bands are tired of.</H2>
        <div className="mt-10 grid border-t border-l border-line md:grid-cols-2">
          {[
            ["01", "leftover stock", "No more boxes of unsold shirts.", "Guessing quantities means dead stock under the bed. Rounds only print what fans have already paid for, in the sizes they picked."],
            ["02", "no chasing", "No chasing pre-order payments.", "Cards are saved at pledge and charged automatically. Declines are retried. You never send a “hey, did you pay?” DM again."],
            ["03", "no upfront risk", "No paying the printer upfront.", "The printer is paid from fans' money after the round succeeds. If it doesn't, nothing is spent."],
            ["04", "no fee surprises", "Card fees are on us.", "Fans pay the listed price. Merch Round takes 10% and covers the card fees out of it. Nothing extra comes out of your share."],
          ].map(([n, tag, title, body]) => (
            <Cell key={n} className="border-t-0 border-l-0 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <PixelNum>{n}</PixelNum>
                <span className="label">{tag}</span>
              </div>
              <H3 className="mt-6">{title}</H3>
              <p className="mt-3 max-w-[460px] text-ash">{body}</p>
            </Cell>
          ))}
        </div>
      </section>

      {/* ───────── artists / calculator ───────── */}
      <section id="artists" className="scroll-mt-20 border-y border-line bg-ink text-paper">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="label !text-paper/60">
              <span className="text-paper/40">{"// "}</span>for artists
            </div>
            <h2 className="mt-3 font-display text-[36px] leading-[1.02] font-bold tracking-tight sm:text-[48px]">What you take home.</h2>
            <p className="mt-4 max-w-[460px] text-paper/70">
              Plug in your numbers. We suggest the target with a 30% buffer, so a few declined cards don&apos;t sink the round.
            </p>
            <div className="relative mt-10 aspect-square max-w-[380px] overflow-hidden border border-paper/15">
              <div className="absolute inset-0 opacity-60">
                <Halftone dark density={10} />
              </div>
              <div className="absolute inset-10">
                <MerchMock product="tee" colorway="black" motif="rings" accent="#9ad84a" label="The Static Hours" />
              </div>
            </div>
          </div>
          <Calculator />
        </div>
      </section>

      {/* ───────── demo accounts ───────── */}
      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        <Label>try it</Label>
        <H2 className="mt-3">Three demo accounts. One full round.</H2>
        <p className="mt-3 max-w-[620px] text-ash">
          Everything is simulated in your browser. Pledge as a fan, run a round as an artist, and approve, print and pay out as admin. Use
          the demo controls to jump through time.
        </p>
        <DemoAccounts />
      </section>

      <Footer />
    </div>
  );
}

function Step({ n, tag, title, body, children }: { n: string; tag: string; title: string; body?: string; children: React.ReactNode }) {
  return (
    <Cell className="border-t-0 border-l-0 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <PixelNum>{n}</PixelNum>
        <span className="label">{tag}</span>
      </div>
      <div className="halftone-dark mt-6 h-[170px] overflow-hidden rounded-[6px]">{children}</div>
      <H3 className="mt-6">{title}</H3>
      {body && <p className="mt-3 max-w-[460px] text-ash">{body}</p>}
      {!body && (
        <p className="mt-3 max-w-[460px] text-ash">
          Fans pick a size, save a card and get told the exact date they&apos;d be charged. No account needed. If the round misses, cards are
          released and nothing is charged.
        </p>
      )}
    </Cell>
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
    <div className="border border-paper/20 bg-coal p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["price (A$)", price, setPrice],
          ["printer quote (A$)", quote, setQuote],
          ["printer min run", minRun, setMinRun],
        ].map(([l, v, set]) => (
          <label key={l as string} className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-paper/60">{l as string}</span>
            <Input
              inputMode="numeric"
              value={String(v)}
              onChange={(e) => (set as (n: number) => void)(num(e.target.value))}
              className="border-paper/20 bg-ink text-paper focus:border-lime"
            />
          </label>
        ))}
      </div>
      <div className="mt-8 flex items-end justify-between border-y border-paper/15 py-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-paper/60">suggested target</div>
          <div className="font-display text-[56px] leading-none font-extrabold text-lime tabular">{target}</div>
        </div>
        <div className="text-right text-[12px] text-paper/60">
          fans at {aud(price)}
          <br />
          over 14 days
        </div>
      </div>
      <Receipt
        className="mt-5 text-paper [&_.border-mute\/60]:border-paper/30"
        rows={[
          { label: `Fans pay (${target} × ${aud(price)})`, value: aud(gross, { cents: true }) },
          { label: "Merch Round (10%, incl. card fees)", value: `−${aud(fee, { cents: true })}` },
          { label: "Printer", value: `−${aud(quote, { cents: true })}` },
        ]}
        total={{ label: "You get", value: <span className="text-lime">{aud(Math.max(0, take), { cents: true })}</span> }}
      />
      <p className="mt-4 text-[12px] text-paper/50">Every extra fan past the target adds {aud(price * 0.9, { cents: true })} to your share.</p>
    </div>
  );
}
