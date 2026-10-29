"use client";

import Image from "next/image";
import { useRef } from "react";
import { TryScreen } from "@/components/try-chrome";
import { Button, Field, Input, LinkButton, Textarea, cx } from "@/components/ui";
import { aud } from "@/lib/demo-math";
import { LENGTH_OPTIONS, useTry, type RoundLengthHours } from "@/lib/try-store";

export default function TrySetupPage() {
  const { state, set, math } = useTry();
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    set({ imageUrl: url });
  }

  return (
    <TryScreen
      step={2}
      title="Set it up"
      footer={
        <LinkButton href="/try/live" variant="brick" size="lg" className="w-full">
          Launch the round
        </LinkButton>
      }
    >
      <section className="space-y-3">
        <h2 className="label">1 · Design</h2>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0]);
          }}
          className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden border-2 border-dashed border-ink/25 bg-stone text-center"
        >
          {state.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={state.imageUrl} alt="Your mock-up" className="absolute inset-0 size-full object-cover" />
          ) : (
            <>
              <Image src="/merch/tee.jpg" alt="" fill className="object-cover opacity-40" sizes="400px" />
              <span className="relative z-10 rounded-[4px] bg-paper/90 px-3 py-2 text-[13px] font-semibold">
                Drop a front image · PNG/JPG
              </span>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <Field label="Description">
          <Textarea
            value={state.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            placeholder="One or two lines fans will see"
          />
        </Field>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="label">2 · Numbers</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (A$)">
            <Input
              type="number"
              min={1}
              value={state.price}
              onChange={(e) => set({ price: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Fans needed">
            <Input
              type="number"
              min={1}
              value={state.target}
              onChange={(e) => set({ target: Number(e.target.value) || 0 })}
            />
          </Field>
        </div>
        <Field label="Printer quote (A$)" hint="No quote yet? We'll help you get one.">
          <Input
            type="number"
            min={0}
            value={state.printerQuote}
            onChange={(e) => set({ printerQuote: Number(e.target.value) || 0 })}
          />
        </Field>
        <div className="rounded-[4px] border border-ink bg-brick-soft p-4 text-[13px] leading-relaxed">
          <div className="font-display text-[16px]">Take home</div>
          <dl className="mt-2 space-y-1">
            <Line label="Fans pay" value={aud(math.fansPay)} />
            <Line label="Merch Round 10%" value={aud(math.fee)} />
            <Line label="Printer" value={aud(math.printerQuote)} />
            <Line label="You get" value={aud(math.artist)} strong />
            <Line label="Each fan past target" value={`+${aud(math.perExtra)}`} />
          </dl>
        </div>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="label">3 · Show &amp; length</h2>
        <Field label="Venue">
          <Input value={state.venue} onChange={(e) => set({ venue: e.target.value })} />
        </Field>
        <Field label="Show date">
          <Input type="date" value={state.showDate} onChange={(e) => set({ showDate: e.target.value })} />
        </Field>
        <div>
          <div className="label mb-2">Round length</div>
          <div className="grid grid-cols-2 gap-2">
            {LENGTH_OPTIONS.map((opt) => (
              <button
                key={opt.hours}
                type="button"
                onClick={() => set({ lengthHours: opt.hours as RoundLengthHours })}
                className={cx(
                  "rounded-[4px] border px-3 py-2.5 text-left text-[13px] font-semibold",
                  state.lengthHours === opt.hours ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink",
                )}
              >
                {opt.label}
                {opt.hint && <span className="mt-0.5 block text-[11px] font-normal opacity-80">{opt.hint}</span>}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-ash">
            One week is recommended. Two weeks is the maximum. Close early enough to print before the show (about 2–2.5 weeks).
          </p>
        </div>
      </section>

      <div className="mt-4">
        <Button type="button" variant="ghost" size="sm" onClick={() => set({ imageUrl: null, description: "Merch Round Tee", price: 55, target: 25, printerQuote: 900 })}>
          Reset examples
        </Button>
      </div>
    </TryScreen>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cx("flex justify-between gap-3", strong && "mt-1 border-t border-ink/15 pt-1 font-bold")}>
      <dt>{label}</dt>
      <dd className="tabular">{value}</dd>
    </div>
  );
}
