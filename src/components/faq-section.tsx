"use client";

import { useState } from "react";
import { FAQ } from "@/lib/copy";

/** Figma "Common questions": white collapsible rows that open and close independently. */
export function FaqSection() {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section id="faq" className="scroll-mt-20 bg-stone">
      <div className="mx-auto max-w-[810px] px-5 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-[70px]">
        <h2 className="text-center font-display text-[30px] leading-tight sm:text-[42px]">{FAQ.heading}</h2>
        <p className="mt-3 text-center text-[16px] font-light text-ash sm:mt-5 sm:text-[18px]">{FAQ.sub}</p>

        <ul className="mt-6 space-y-[5px] sm:mt-7">
          {FAQ.items.map((item, i) => {
            const isOpen = open.has(i);
            const id = `faq-${i}`;
            return (
              <li key={item.q} className="rounded-[4px] bg-paper">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => toggle(i)}
                  className="flex min-h-[57px] w-full items-center justify-between gap-4 px-5 py-3.5 text-left sm:px-[25px]"
                >
                  <span className="text-[16px] font-medium leading-snug sm:text-[17px]">{item.q}</span>
                  <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-ink/60" aria-hidden>
                    <path d="M2 8h12" stroke="currentColor" strokeWidth="1.2" />
                    {!isOpen && <path d="M8 2v12" stroke="currentColor" strokeWidth="1.2" />}
                  </svg>
                </button>
                {isOpen && (
                  <div id={id} className="px-5 pb-5 text-[15px] font-light leading-[1.5] text-ink/80 sm:px-[25px] sm:pr-16">
                    <p>{item.a}</p>
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
