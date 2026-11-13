"use client";

import { useState } from "react";
import { FAQ } from "@/lib/copy";
import { cx } from "./ui";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 border-b border-line bg-paper">
      <div className="mx-auto max-w-[800px] px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="text-center font-display text-[clamp(28px,4.5vw,44px)] leading-none">{FAQ.heading}</h2>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {FAQ.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-[17px] leading-snug sm:text-[18px]">{item.q}</span>
                  <span
                    className={cx(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[4px] border border-ink text-[18px] leading-none transition",
                      isOpen && "bg-ink text-paper",
                    )}
                    aria-hidden
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-5 pr-12 text-[15px] leading-relaxed text-ash">
                    <p>{item.a}</p>
                    {"pendingLegal" in item && item.pendingLegal && (
                      <p className="mt-2 text-[13px] text-mute">Legal wording still in review with the team.</p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
