"use client";

import { useState } from "react";
import { ACTION, ARTIST_DEMO, FAN_DEMO } from "@/lib/copy";
import { ArtistSlide, FanSlide } from "./demo-slides";
import { cx } from "./ui";

/** Artist slides used in the new tabbed demo (maps to denser Figma steps). */
const ARTIST_SLIDE_INDEX = [1, 2, 3] as const;
/** Fan slides used in the new tabbed demo. */
const FAN_SLIDE_INDEX = [0, 1, 4] as const;

export function ActionCarousels() {
  const [tab, setTab] = useState<"artist" | "fan">("artist");
  const [step, setStep] = useState(0);

  const steps = tab === "artist" ? ARTIST_DEMO : FAN_DEMO;
  const slideIndex = tab === "artist" ? ARTIST_SLIDE_INDEX[step]! : FAN_SLIDE_INDEX[step]!;
  const total = steps.length;

  const switchTab = (next: "artist" | "fan") => {
    setTab(next);
    setStep(0);
  };

  const prev = () => setStep((s) => (s - 1 + total) % total);
  const next = () => setStep((s) => (s + 1) % total);

  const current = steps[step]!;

  return (
    <div className="mt-10">
      <div className="mx-auto flex w-fit items-center rounded-full border border-line bg-paper p-1">
        <button
          type="button"
          onClick={() => switchTab("artist")}
          className={cx(
            "rounded-full px-5 py-2 text-[14px] font-semibold transition",
            tab === "artist" ? "bg-ink text-paper" : "text-ash hover:text-ink",
          )}
        >
          {ACTION.artistTab}
        </button>
        <button
          type="button"
          onClick={() => switchTab("fan")}
          className={cx(
            "rounded-full px-5 py-2 text-[14px] font-semibold transition",
            tab === "fan" ? "bg-ink text-paper" : "text-ash hover:text-ink",
          )}
        >
          {ACTION.fanTab}
        </button>
      </div>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="max-w-md lg:justify-self-end">
          <p className="label text-ash">
            {tab === "artist" ? ACTION.artistLabel : ACTION.fanLabel} · Step {step + 1} of {total}
          </p>
          <h3 className="mt-3 font-display text-[clamp(24px,3.5vw,36px)] leading-none">{current.name}</h3>
          <p className="mt-4 text-[16px] leading-relaxed text-ash">{current.body}</p>
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous step"
              className="flex size-10 items-center justify-center rounded-[8px] border border-ink text-[18px] font-semibold leading-none text-ink transition hover:bg-ink hover:text-paper"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to step ${i + 1}`}
                  onClick={() => setStep(i)}
                  className={cx("h-2 rounded-[2px] transition-all", i === step ? "w-5 bg-ink" : "w-2 bg-line hover:bg-mute")}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next step"
              className="flex size-10 items-center justify-center rounded-[8px] border border-ink text-[18px] font-semibold leading-none text-ink transition hover:bg-ink hover:text-paper"
            >
              ›
            </button>
          </div>
        </div>

        <div
          className="mx-auto w-full max-w-[380px] touch-pan-y lg:mx-0"
          onTouchStart={(e) => {
            const t = e.touches[0];
            (e.currentTarget as HTMLElement).dataset.tx = String(t?.clientX ?? 0);
            (e.currentTarget as HTMLElement).dataset.ty = String(t?.clientY ?? 0);
          }}
          onTouchEnd={(e) => {
            const el = e.currentTarget as HTMLElement;
            const startX = Number(el.dataset.tx || 0);
            const startY = Number(el.dataset.ty || 0);
            const endX = e.changedTouches[0]?.clientX ?? startX;
            const endY = e.changedTouches[0]?.clientY ?? startY;
            const dx = endX - startX;
            const dy = endY - startY;
            if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
            if (dx > 0) prev();
            else next();
          }}
        >
          <div className="aspect-[388/580] overflow-hidden rounded-[16px] border border-line bg-paper shadow-[0_24px_60px_rgba(1,1,0,0.08)]">
            {tab === "artist" ? <ArtistSlide index={slideIndex} /> : <FanSlide index={slideIndex} />}
          </div>
        </div>
      </div>
    </div>
  );
}
