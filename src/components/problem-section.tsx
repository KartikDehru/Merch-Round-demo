import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { PROBLEM } from "@/lib/copy";

export function ProblemSection() {
  return (
    <section className="border-b border-line bg-stone">
      <div className="mx-auto max-w-[1265px] px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="text-center font-display text-[clamp(32px,5vw,52px)] leading-none">{PROBLEM.heading}</h2>
        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div>
            <p className="label text-ash">{PROBLEM.theyLabel}</p>
            <ul className="mt-6 space-y-4">
              {PROBLEM.bubbles.map((text, i) => (
                <li
                  key={text}
                  className={`relative max-w-[440px] rounded-[20px] bg-paper px-5 py-4 text-[15px] leading-relaxed text-ink shadow-[0_10px_30px_rgba(17,17,17,0.06)] ${
                    i === 1 ? "sm:ml-10" : i === 2 ? "sm:ml-5" : ""
                  }`}
                >
                  <span className="text-mute">&ldquo;</span>
                  {text}
                  <span className="text-mute">&rdquo;</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-ash">
              So do{" "}
              <span className="relative inline-block text-ink">
                we
                <svg
                  className="pointer-events-none absolute -inset-x-2 -inset-y-1 text-brick"
                  viewBox="0 0 80 40"
                  fill="none"
                  aria-hidden
                >
                  <ellipse cx="40" cy="20" rx="36" ry="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </p>
            <div className="mt-6 overflow-hidden rounded-[20px] bg-paper shadow-[0_24px_60px_rgba(17,17,17,0.12)]">
              <div className="relative aspect-[5/4] bg-haze">
                <Image src="/merch/tee.jpg" alt="" fill className="object-contain p-6" sizes="520px" priority={false} />
              </div>
              <div className="grid grid-cols-[1fr_auto] items-end gap-4 border-t border-line p-5 sm:p-6">
                <div className="min-w-0 space-y-3">
                  <div>
                    <p className="label text-mute">Show date</p>
                    <p className="mt-0.5 text-[15px] font-semibold">{PROBLEM.ticket.showDate}</p>
                  </div>
                  <div>
                    <p className="label text-mute">Item</p>
                    <p className="mt-0.5 text-[15px] font-semibold leading-snug">
                      {PROBLEM.ticket.item}
                      <span className="text-ash"> · {PROBLEM.ticket.size}</span>
                    </p>
                  </div>
                  <div>
                    <p className="label text-mute">Pickup code</p>
                    <p className="mt-0.5 font-mono text-[22px] font-bold tracking-[0.14em]">{PROBLEM.ticket.code}</p>
                  </div>
                </div>
                <div className="rounded-[8px] border border-line bg-paper p-2">
                  <QRCodeSVG value="https://merchround.com/pickup/MR4821" size={100} level="M" includeMargin={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
