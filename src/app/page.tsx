import Image from "next/image";
import { ActionCarousels } from "@/components/action-carousels";
import { FaqSection } from "@/components/faq-section";
import { HowSection } from "@/components/how-section";
import { LiveRoundSection } from "@/components/live-round-section";
import { ProblemSection } from "@/components/problem-section";
import { VideoSection } from "@/components/video-section";
import { WaitlistForm } from "@/components/waitlist-form";
import { LinkButton } from "@/components/ui";
import { ACTION, HERO, WAITLIST } from "@/lib/copy";

export default function Home() {
  return (
    <div>
      {/* Hero — Figma Master / Landing full-bleed photo */}
      <section className="relative isolate min-h-[min(82vh,760px)] overflow-hidden bg-ink text-paper">
        <Image
          src="/photos/hero-booth.jpg"
          alt="Merch hanging at a live show"
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/55 to-ink/75" />
        <div className="relative mx-auto flex max-w-[900px] flex-col items-center px-5 py-28 text-center sm:px-8 sm:py-36">
          <h1 className="animate-rise font-display text-[clamp(44px,8vw,84px)] leading-[0.92]">
            {HERO.headline}
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-[16px] leading-relaxed text-paper/90 sm:text-[19px] [animation-delay:60ms]">
            {HERO.sub}
          </p>
          <div className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-3 [animation-delay:120ms]">
            <LinkButton href="/#waitlist" variant="brick" size="lg" className="min-w-[180px] rounded-[6px]">
              {HERO.earlyAccessCta}
            </LinkButton>
            <LinkButton
              href="/try"
              variant="secondary"
              size="lg"
              className="rounded-[6px] border-paper/80 text-paper hover:bg-paper hover:text-ink"
            >
              {HERO.tryCta}
              <span aria-hidden>→</span>
            </LinkButton>
          </div>
        </div>
      </section>

      <ProblemSection />
      <VideoSection />
      <HowSection />
      <LiveRoundSection />

      {/* Interactive demo — Artist / Fan toggle */}
      <section id="action" className="scroll-mt-20 border-b border-line bg-stone">
        <div className="mx-auto max-w-[1265px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="mx-auto max-w-3xl text-center font-display text-[clamp(28px,4.5vw,48px)] leading-none">
            {ACTION.heading}
          </h2>
          <div className="mt-12 rounded-[24px] border border-line bg-paper px-4 py-10 shadow-[0_24px_60px_rgba(17,17,17,0.06)] sm:px-8 sm:py-14">
            <ActionCarousels />
          </div>
          <div className="mt-12 text-center">
            <LinkButton href="/try" variant="brick" size="lg" className="rounded-[6px]">
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
            <h2 className="font-display text-[clamp(32px,5vw,52px)] leading-none">{WAITLIST.heading}</h2>
            <p className="mt-4 max-w-md text-[16px] text-paper/75 sm:text-[17px]">{WAITLIST.subheading}</p>
          </div>
          <div className="rounded-[16px] border border-paper/15 bg-paper p-5 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.25)] sm:p-8">
            <WaitlistForm source="landing" />
          </div>
        </div>
      </section>
    </div>
  );
}
