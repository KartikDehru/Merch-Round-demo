import Image from "next/image";
import Link from "next/link";
import { CostsSection } from "@/components/costs-section";
import { FaqSection } from "@/components/faq-section";
import { HowSection } from "@/components/how-section";
import { LiveRoundSection } from "@/components/live-round-section";
import { ProblemSection } from "@/components/problem-section";
import { SeeItInAction } from "@/components/see-it-in-action";
import { WaitlistForm } from "@/components/waitlist-form";
import { WhoSection } from "@/components/who-section";
import { HERO, WAITLIST } from "@/lib/copy";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowSection />
      <LiveRoundSection />
      <SeeItInAction />
      <WhoSection />
      <CostsSection />
      <FaqSection />
      <Waitlist />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      <Image
        src="/figma/hero.jpg"
        alt="Fans lined up at a merch stand inside a venue"
        fill
        priority
        className="-z-10 object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-ink/45" />
      <div className="mx-auto flex min-h-[365px] max-w-[1265px] flex-col items-center justify-center px-5 py-12 text-center sm:min-h-[489px] sm:px-12">
        <h1 className="animate-rise font-display text-[44px] leading-[1.02] sm:text-[78px]">{HERO.headline}</h1>
        <p className="animate-rise mt-4 max-w-[600px] text-[15px] font-light leading-[1.5] text-paper/90 [animation-delay:60ms] sm:mt-5 sm:text-[19px]">
          {HERO.sub}
          <br />
          {HERO.sub2}
        </p>
        <div className="animate-rise mt-7 flex items-center justify-center gap-4 [animation-delay:120ms] sm:mt-8 sm:gap-6">
          <a
            href="#waitlist"
            className="flex h-[44px] items-center rounded-[3px] bg-brick px-5 text-[13px] font-bold uppercase text-ink transition hover:bg-brick-deep sm:h-[50px] sm:px-6 sm:text-[14px]"
          >
            {HERO.earlyAccessCta}
          </a>
          <Link
            href="/try"
            className="group flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.04em] text-paper sm:text-[14px]"
          >
            {HERO.tryCta}
            <svg viewBox="0 0 12 12" className="size-3 text-brick transition group-hover:translate-x-0.5" aria-hidden>
              <path d="m4 2 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  return (
    <section id="waitlist" className="scroll-mt-20 bg-ink text-paper">
      <div className="mx-auto max-w-[1265px] px-5 pb-16 pt-14 sm:px-12 sm:pb-[95px] sm:pt-[100px]">
        <h2 className="text-center font-display text-[32px] leading-tight sm:text-[42px]">{WAITLIST.heading}</h2>
        <p className="mx-auto mt-3 max-w-[340px] text-center text-[15px] font-light leading-[1.6] text-paper/80 sm:max-w-none sm:text-[17px]">
          {WAITLIST.subheading[0]}
          <br />
          {WAITLIST.subheading[1]}
        </p>
        <div className="mx-auto mt-9 max-w-[521px] rounded-[4px] bg-paper px-5 py-7 text-ink sm:mt-11 sm:px-8 sm:py-8">
          <WaitlistForm source="landing" variant="figma" />
        </div>
      </div>
    </section>
  );
}
