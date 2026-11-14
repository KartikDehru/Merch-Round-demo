import Image from "next/image";
import type { ReactNode } from "react";
import { WHO } from "@/lib/copy";
import { cx } from "@/lib/cx";

/** Figma "Who does what": four role cards on #111. */
export function WhoSection() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-[1265px] px-5 pb-14 pt-12 sm:px-12 sm:pb-[52px] sm:pt-[60px]">
        <h2 className="text-center font-display text-[30px] leading-tight sm:text-[42px]">{WHO.heading}</h2>
        <p className="mx-auto mt-3 max-w-[340px] text-center text-[15px] font-light leading-[1.6] text-paper/80 sm:max-w-none sm:text-[18px]">
          {WHO.sub[0]}
          <br />
          {WHO.sub[1]}
        </p>

        <div className="mx-auto mt-9 grid max-w-[1150px] gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHO.cards.map((card, i) => {
            const lime = i === 3;
            return (
              <article
                key={card.label}
                className={cx(
                  "overflow-hidden rounded-[10px] border",
                  lime ? "border-brick bg-brick text-ink" : "border-paper/10 bg-panel",
                )}
              >
                <div className="relative h-[270px] overflow-hidden sm:h-[230px]">{IMAGES[i]}</div>
                <div className="px-5 pb-8 pt-6 sm:px-6">
                  <p className={cx("text-[11px] font-bold uppercase tracking-[0.12em]", lime ? "text-ink" : "text-brick")}>
                    {card.label}
                  </p>
                  <h3 className="mt-3 text-[22px] font-bold leading-tight">{card.title}</h3>
                  <p className={cx("mt-3 text-[15px] font-light leading-[1.45]", lime ? "text-ink" : "text-paper/75")}>
                    {card.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" />;
}

const IMAGES: ReactNode[] = [
  <div key="artist" className="absolute inset-0 bg-gradient-to-br from-[#f1f6e6] to-[#e3edcc]">
    <div className="absolute inset-y-0 left-[4%] right-[-2%] top-[6px] rounded-tl-[18px] bg-[#f5f8ed] shadow-[0_0_0_1px_rgba(17,17,17,0.04)]" />
    <div className="absolute bottom-[14px] left-[12%] right-0 top-[30px] rounded-tl-[14px] bg-paper px-4 pt-4 shadow-[0_4px_20px_rgba(17,17,17,0.06)]">
      <p className="font-display text-[19px] leading-none text-ink">Set it up</p>
      <div className="mt-4 h-[calc(100%-46px)] border-[1.5px] border-r-0 border-brick bg-stone px-4 pt-1.5">
        <div className="relative mx-auto h-[calc(100%-18px)] max-w-[110px] bg-paper">
          <Image src="/merch/tee.jpg" alt="" fill className="object-contain" sizes="110px" />
        </div>
        <p className="mt-0.5 text-center text-[8px] text-ash">this-round-is-on-us-tee.png</p>
      </div>
    </div>
  </div>,

  <div key="fan" className="absolute inset-0 bg-paper">
    <div className="absolute -left-6 -right-6 top-[-6px] origin-center -rotate-[6deg] px-8 pt-3 text-ink">
      <p className="font-display text-[28px] leading-none">Join the round</p>
      <div className="mt-2.5 flex items-center gap-2.5 rounded-[4px] bg-[#dcf3bc] p-2.5">
        <span className="relative size-[46px] shrink-0 bg-paper">
          <Image src="/merch/tee.jpg" alt="" fill className="object-contain" sizes="46px" />
        </span>
        <div className="min-w-0 flex-1 text-[10px] leading-[1.5]">
          <p>This Round Is On Us Tee · M</p>
          <p>Pick up at The Servo · 24 Nov</p>
        </div>
        <span className="self-start text-[10px]">A$55</span>
      </div>
      <p className="mt-3 text-[9px] text-ash">Payment details</p>
      <div className="mt-1.5 rounded-[6px] border border-ink/15 text-[10px]">
        <p className="flex justify-between border-b border-ink/10 px-3 py-3">
          <span>•••• •••• •••• 4242</span>
          <span className="tracking-[2px]">•••</span>
        </p>
        <p className="px-3 py-3">11 / 28</p>
      </div>
    </div>
  </div>,

  <Photo key="printer" src="/figma/printer.jpg" alt="A screen printer laying down yellow ink" />,
  <Photo key="wall" src="/figma/merch-wall.jpg" alt="A wall of band tees at a merch stand" />,
];
