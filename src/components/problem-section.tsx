import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { PROBLEM } from "@/lib/copy";

export function ProblemSection() {
  return (
    <section className="border-b border-line bg-stone">
      <div className="mx-auto max-w-[1265px] px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="text-center font-display text-[clamp(28px,4.5vw,44px)] leading-none">{PROBLEM.heading}</h2>
        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <p className="label text-ash">{PROBLEM.theyLabel}</p>
            <ul className="mt-5 space-y-4">
              {PROBLEM.bubbles.map((text, i) => (
                <li
                  key={text}
                  className={`max-w-[420px] rounded-[16px] bg-paper px-5 py-4 text-[15px] leading-relaxed text-ink shadow-[0_8px_24px_rgba(1,1,0,0.04)] ${
                    i === 1 ? "ml-0 sm:ml-8" : i === 2 ? "ml-0 sm:ml-4" : ""
                  }`}
                >
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-ash">{PROBLEM.weLabel}</p>
            <div className="mt-5 overflow-hidden rounded-[16px] border border-line bg-paper shadow-[0_16px_40px_rgba(1,1,0,0.08)]">
              <div className="relative aspect-[16/10] bg-stone">
                <Image src="/merch/tee.jpg" alt="" fill className="object-contain p-4" sizes="480px" />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4 p-5">
                <div className="min-w-0">
                  <p className="label text-mute">Show date</p>
                  <p className="mt-1 font-semibold">{PROBLEM.ticket.showDate}</p>
                  <p className="label mt-3 text-mute">Item</p>
                  <p className="mt-1 font-semibold leading-snug">
                    {PROBLEM.ticket.item}
                    <span className="text-ash"> · {PROBLEM.ticket.size}</span>
                  </p>
                  <p className="label mt-3 text-mute">Pickup code</p>
                  <p className="mt-1 font-mono text-[20px] font-bold tracking-[0.12em]">{PROBLEM.ticket.code}</p>
                </div>
                <div className="flex items-end">
                  <QRCodeSVG value="https://merchround.com/pickup/MR4821" size={96} level="M" includeMargin={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
