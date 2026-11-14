import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { PROBLEM } from "@/lib/copy";
import { cx } from "@/lib/cx";

export function ProblemSection() {
  const t = PROBLEM.ticket;
  return (
    <section className="bg-stone">
      <div className="mx-auto max-w-[1265px] px-5 pb-14 pt-12 sm:px-12 sm:pb-14 sm:pt-[30px]">
        <h2 className="text-center font-display text-[30px] leading-tight sm:text-[42px]">{PROBLEM.heading}</h2>

        <div className="mt-8 grid gap-14 lg:mt-7 lg:grid-cols-2 lg:gap-0">
          <div className="lg:border-r lg:border-ink/25 lg:pr-[70px]">
            <h3 className="text-center font-display text-[38px] leading-none sm:text-[52px]">{PROBLEM.theyLabel}</h3>
            <ul className="mt-8 space-y-6 sm:mt-11 sm:space-y-[38px]">
              {PROBLEM.bubbles.map((text, i) => (
                <li
                  key={text}
                  className={cx(
                    "max-w-[430px] rounded-[16px] bg-bubble px-5 py-4 text-[15px] font-light leading-[1.45] text-ink sm:text-[17px]",
                    i === 1 && "ml-auto mr-0 sm:ml-[90px]",
                  )}
                >
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-center text-[11px] text-ash sm:mt-11">{PROBLEM.caption}</p>
          </div>

          <div className="flex flex-col items-center lg:pl-[70px]">
            <h3 className="font-display text-[38px] leading-none sm:text-[52px]">
              {PROBLEM.weLabelLead}{" "}
              <span className="relative inline-block px-1">
                {PROBLEM.weLabelCircled}
                <svg
                  className="pointer-events-none absolute -inset-x-3 -inset-y-2.5 h-[calc(100%+20px)] w-[calc(100%+24px)] text-brick"
                  viewBox="0 0 100 60"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M58 4 C84 3 98 14 97 30 C96 47 76 57 48 56 C20 55 3 45 3 30 C3 14 22 5 46 4"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
            </h3>

            <div className="mt-8 w-full max-w-[398px] rounded-[20px] bg-paper p-3.5 shadow-[0_6px_24px_rgba(17,17,17,0.08)] sm:mt-9 sm:p-4">
              <div className="relative aspect-[368/230] overflow-hidden rounded-[12px] border border-ink/10 bg-paper">
                <Image src="/merch/tee.jpg" alt="This Round Is On Us tee" fill className="object-contain" sizes="380px" />
              </div>
              <div className="flex items-end gap-6 px-1 pb-1 pt-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ash">Show date</p>
                  <p className="mt-0.5 font-display text-[30px] leading-none">{t.showDate}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ash">Item</p>
                  <p className="mt-0.5 text-[17px] font-bold leading-tight">{t.item}</p>
                  <p className="text-[12px] font-bold text-ash">{t.size}</p>
                </div>
              </div>

              <div className="relative -mx-3.5 my-4 sm:-mx-4" aria-hidden>
                <div className="mx-3.5 border-t-2 border-dashed border-ink/15 sm:mx-4" />
                <span className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-stone" />
                <span className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-stone" />
              </div>

              <div className="flex items-center justify-between gap-4 px-1 pb-1">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ash">Pickup code</p>
                  <p className="mt-1 font-display text-[24px] leading-none">{t.code}</p>
                  <p className="mt-3 text-[13px] font-bold">{t.venue}</p>
                  <p className="mt-2 text-[12px] leading-snug text-ash">
                    {t.note[0]}
                    <br />
                    {t.note[1]}
                  </p>
                </div>
                <QRCodeSVG
                  value="https://merchround.com/pickup/MR4821"
                  size={140}
                  level="M"
                  className="size-[112px] shrink-0 sm:size-[140px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
