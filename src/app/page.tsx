import Image from "next/image";
import { ActionCarousels } from "@/components/action-carousels";
import { FaqSection } from "@/components/faq-section";
import { LiveRoundSection } from "@/components/live-round-section";
import { ProblemSection } from "@/components/problem-section";
import { VideoSection } from "@/components/video-section";
import { WaitlistForm } from "@/components/waitlist-form";
import { LinkButton } from "@/components/ui";
import { ACTION, HERO, HOW, WAITLIST } from "@/lib/copy";

export default function Home() {
  return (
    <div>
      {/* Hero — Figma Master / Landing */}
      <section className="relative isolate min-h-[min(78vh,720px)] overflow-hidden bg-ink text-paper">
        <Image
          src="/photos/crowd.jpg"
          alt="Crowd at a live show"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative mx-auto flex max-w-[880px] flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32">
          <h1 className="animate-rise font-display text-[clamp(40px,7vw,72px)] leading-[0.95] tracking-[-0.03em]">
            {HERO.headline}
          </h1>
          <p className="animate-rise mt-5 max-w-xl text-[16px] leading-relaxed text-paper/90 sm:text-[18px] [animation-delay:60ms]">
            {HERO.sub}
          </p>
          <div className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3 [animation-delay:120ms]">
            <LinkButton href="/#waitlist" variant="brick" size="lg">
              {HERO.earlyAccessCta}
            </LinkButton>
            <LinkButton
              href="/try"
              variant="secondary"
              size="lg"
              className="border-paper text-paper hover:bg-paper hover:text-ink"
            >
              {HERO.tryCta}
              <span aria-hidden>→</span>
            </LinkButton>
          </div>
        </div>
      </section>

      <ProblemSection />
      <VideoSection />

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-b border-line bg-paper">
        <div className="mx-auto max-w-[1265px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="text-center font-display text-[clamp(28px,4.5vw,44px)] leading-none">{HOW.heading}</h2>
          <p className="mt-3 text-center text-[17px] text-ash">{HOW.subheading}</p>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.steps.map((step, i) => (
              <li key={step.title} className="rounded-[16px] border border-line bg-stone p-5">
                <div className="font-display text-[28px] text-brick">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 font-display text-[20px] leading-tight">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ash">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <LiveRoundSection />

      {/* Interactive demo — Artist / Fan toggle */}
      <section id="action" className="scroll-mt-20 border-b border-line bg-paper">
        <div className="mx-auto max-w-[1265px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="mx-auto max-w-3xl text-center font-display text-[clamp(28px,4.5vw,44px)] leading-none">
            {ACTION.heading}
          </h2>
          <ActionCarousels />
          <div className="mt-12 text-center">
            <LinkButton href="/try" variant="brick" size="lg">
              {HERO.tryCta}
            </LinkButton>
          </div>
        </div>
      </section>

      <FaqSection />

      {/* Waitlist / early access */}
      <section id="waitlist" className="scroll-mt-20 bg-ink text-paper">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <h2 className="font-display text-[clamp(28px,4.5vw,44px)] leading-none">{WAITLIST.heading}</h2>
            <p className="mt-4 max-w-md text-[16px] text-paper/80">{WAITLIST.subheading}</p>
          </div>
          <div className="rounded-[16px] border border-paper/20 bg-paper p-5 text-ink sm:p-8">
            <WaitlistForm source="landing" />
          </div>
        </div>
      </section>
    </div>
  );
}
