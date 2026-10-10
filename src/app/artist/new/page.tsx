"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useWorld } from "@/lib/store";
import { createRound, uid } from "@/lib/actions";
import { DAY, FEE_RATE, ROUND_DAYS, latestSafeClose, suggestTarget } from "@/lib/domain";
import { aud, date } from "@/lib/format";
import type { Colorway, PrintMotif, ProductKind, Round } from "@/lib/types";
import { RequireRole } from "@/components/require-role";
import { Receipt } from "@/components/round-bits";
import { MerchMock, Tally } from "@/components/visuals";
import { Button, Field, H1, Input, Select, Textarea, cx } from "@/components/ui";

const PRINTERS = [
  { name: "Inkhouse Wollongong", lead: 3 },
  { name: "Marrickville Screenworks", lead: 2 },
  { name: "Southside Screen Co.", lead: 3 },
  { name: "Brisbane Print Lab", lead: 4 },
];

export default function NewRoundPage() {
  return (
    <RequireRole role="artist">
      <Wizard />
    </RequireRole>
  );
}

function Wizard() {
  const { world, act, toast } = useWorld();
  const router = useRouter();
  const artist = world.artists.find((a) => a.id === world.session.artistId)!;
  const [step, setStep] = useState(0);
  const [now] = useState(() => Date.now());

  const [title, setTitle] = useState("Encore Longsleeve");
  const [product, setProduct] = useState<ProductKind>("tee");
  const [colorway, setColorway] = useState<Colorway>("black");
  const [motif, setMotif] = useState<PrintMotif>("sun");
  const [description, setDescription] = useState("Long sleeve for the encore. Front sun print, dates down the sleeve.");
  const [sizes, setSizes] = useState(["S", "M", "L", "XL"]);
  const [price, setPrice] = useState(55);
  const [printer, setPrinter] = useState(PRINTERS[0].name);
  const [quote, setQuote] = useState(900);
  const [minRun, setMinRun] = useState(25);
  const [lead, setLead] = useState(3);
  const [targetBump, setTargetBump] = useState(0);
  const [showName, setShowName] = useState(`${artist.name} · Encore Night`);
  const [venue, setVenue] = useState("Oxford Art Factory, Sydney");
  const [showDate, setShowDate] = useState(() => new Date(now + 52 * DAY).toISOString().slice(0, 10));
  const [delivery, setDelivery] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(10);
  const [agree, setAgree] = useState(false);

  const suggested = suggestTarget(quote, minRun, price);
  const target = suggested + targetBump;
  const showTs = new Date(`${showDate}T19:00:00`).getTime();
  const safe = latestSafeClose(showTs, lead);
  const close = Math.min(now + ROUND_DAYS * DAY, safe);
  const tooSoon = close < now + 5 * DAY;
  const gross = target * price;
  const fee = gross * FEE_RATE;
  const take = gross - fee - quote;

  const steps = ["The merch", "The numbers", "The show", "Review"];
  const canNext = [title.trim() && sizes.length > 0, price > 0 && quote > 0 && minRun > 0, !!showName && !!venue && !tooSoon, agree][step];

  const preview = useMemo(
    () => ({ product, colorway, motif }),
    [product, colorway, motif],
  );

  const submit = () => {
    const id = uid("r");
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${id.slice(-4)}`;
    const round: Round = {
      id,
      slug,
      artistId: artist.id,
      title,
      product,
      colorway,
      motif,
      description,
      details: ["AS Colour blank", "Screen printed", "Water-based inks"],
      price,
      target,
      printerQuote: quote,
      minRun,
      leadWeeks: lead,
      showName,
      venue,
      showDate: showTs,
      createdAt: now,
      closesAt: close,
      status: "pending_review",
      sizes,
      delivery,
      deliveryFee,
      printer: { name: printer },
    };
    act(createRound(round));
    toast("Submitted for review", "good");
    router.push(`/artist/rounds/${id}`);
  };

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8">
      <Link href="/artist" className="label hover:text-ink">← dashboard</Link>
      <H1 className="mt-3">New round.</H1>
      <p className="mt-2 max-w-[620px] text-ash">A short window where you set the number you need. Rounds run {ROUND_DAYS} days, or less if your show is close.</p>

      <ol className="mt-8 grid grid-cols-4 gap-2">
        {steps.map((s, i) => (
          <li key={s}>
            <button onClick={() => i < step && setStep(i)} className="w-full text-left">
              <div className={cx("h-1.5", i < step ? "bg-ink" : i === step ? "bg-lime" : "bg-line")} />
              <div className={cx("mt-2 text-[11px] uppercase tracking-[0.16em]", i === step ? "text-ink" : "text-mute")}>
                <span className="font-pixel mr-1.5 text-[13px]">{String(i + 1).padStart(2, "0")}</span>
                <span className="hidden sm:inline">{s}</span>
              </div>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="border border-line bg-card p-5 sm:p-7">
          {step === 0 && (
            <div className="grid gap-5">
              <Field label="Name">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <div>
                <span className="label">item</span>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {(["tee", "hoodie", "tote", "cap"] as ProductKind[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setProduct(p);
                        if (p === "tote" || p === "cap") setSizes(["One size"]);
                        else if (sizes[0] === "One size") setSizes(["S", "M", "L", "XL"]);
                      }}
                      className={cx("border p-2 text-[11px] uppercase tracking-[0.14em]", product === p ? "border-ink bg-lime-soft" : "border-line hover:border-ink")}
                    >
                      <div className="mx-auto size-14">
                        <MerchMock product={p} colorway={colorway} motif={motif} accent={artist.accent} />
                      </div>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <span className="label">colour</span>
                  <div className="mt-2 flex gap-2">
                    {(
                      [
                        ["black", "#17181c"],
                        ["bone", "#ece6d8"],
                        ["olive", "#5b6142"],
                        ["navy", "#1d2640"],
                      ] as [Colorway, string][]
                    ).map(([c, hex]) => (
                      <button
                        key={c}
                        aria-label={c}
                        onClick={() => setColorway(c)}
                        className={cx("size-10 border-2", colorway === c ? "border-ink ring-2 ring-lime ring-offset-2" : "border-line")}
                        style={{ background: hex }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="label">artwork (demo motifs)</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(["rings", "wave", "diamond", "sun", "grid"] as PrintMotif[]).map((m) => (
                      <button key={m} onClick={() => setMotif(m)} className={cx("h-10 border px-2.5 text-[11px] uppercase tracking-[0.12em]", motif === m ? "border-ink bg-ink text-paper" : "border-line")}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Field label="Description">
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>
              {product !== "tote" && product !== "cap" && (
                <div>
                  <span className="label">sizes</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSizes((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : ["XS", "S", "M", "L", "XL", "XXL"].filter((x) => cur.includes(x) || x === s)))}
                        className={cx("h-10 w-12 border font-display font-bold", sizes.includes(s) ? "border-ink bg-ink text-paper" : "border-line text-ash")}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="border border-dashed border-line p-4 text-center text-[12px] text-ash">Drop front & back images here · PNG/JPG (demo uses generated mock-ups)</div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Sale price (A$)" hint="What fans pay. No fees on top.">
                  <Input inputMode="numeric" value={price} onChange={(e) => setPrice(Number(e.target.value.replace(/\D/g, "")) || 0)} />
                </Field>
                <Field label="Printer">
                  <Select
                    value={printer}
                    onChange={(e) => {
                      setPrinter(e.target.value);
                      setLead(PRINTERS.find((p) => p.name === e.target.value)?.lead ?? 3);
                    }}
                  >
                    {PRINTERS.map((p) => (
                      <option key={p.name}>{p.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Printer quote (A$)" hint="For the minimum run, incl. GST.">
                  <Input inputMode="numeric" value={quote} onChange={(e) => setQuote(Number(e.target.value.replace(/\D/g, "")) || 0)} />
                </Field>
                <Field label="Printer minimum run">
                  <Input inputMode="numeric" value={minRun} onChange={(e) => setMinRun(Number(e.target.value.replace(/\D/g, "")) || 0)} />
                </Field>
                <Field label="Lead time (weeks)">
                  <Input inputMode="numeric" value={lead} onChange={(e) => setLead(Number(e.target.value.replace(/\D/g, "")) || 1)} />
                </Field>
              </div>
              <div className="border-2 border-ink p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="label">the number you need</div>
                    <div className="font-display text-[64px] leading-none font-extrabold tabular">{target}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setTargetBump((b) => Math.max(0, b - 1))} disabled={targetBump === 0}>−</Button>
                    <Button size="sm" variant="secondary" onClick={() => setTargetBump((b) => b + 1)}>+</Button>
                  </div>
                </div>
                <p className="mt-2 text-[12px] text-ash">
                  Suggested {suggested}: the bigger of your printer&apos;s minimum ({minRun}) or enough to cover the quote with a 30% buffer. You can raise it, not
                  lower it.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5">
              <Field label="Show name">
                <Input value={showName} onChange={(e) => setShowName(e.target.value)} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Venue (pick-up point)">
                  <Input value={venue} onChange={(e) => setVenue(e.target.value)} />
                </Field>
                <Field label="Show date">
                  <Input type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} />
                </Field>
              </div>
              <label className="flex items-center gap-3 border border-line p-4">
                <input type="checkbox" className="size-4 accent-ink" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} />
                <span className="flex-1">
                  <span className="block font-display text-[16px] font-bold">Offer delivery</span>
                  <span className="block text-[12px] text-ash">You pack and post. Fans pay a flat fee.</span>
                </span>
                {delivery && (
                  <Input className="!w-24" inputMode="numeric" value={deliveryFee} onChange={(e) => setDeliveryFee(Number(e.target.value.replace(/\D/g, "")) || 0)} />
                )}
              </label>
              <div className={cx("border-2 p-5", tooSoon ? "border-stop bg-stop-soft" : "border-ink bg-lime-soft")}>
                <div className="label">close date</div>
                <div className="mt-1 font-display text-[28px] font-bold">{date(close, true)}</div>
                <p className="mt-1 text-[12px]">
                  {tooSoon
                    ? `Your show is too close. The printer needs ${lead} weeks plus a week either side. Pick a later show date.`
                    : close === safe
                      ? `Shortened to fit your show: ${lead} weeks printing + 2 weeks buffer before ${date(showTs)}.`
                      : `${ROUND_DAYS} days from today. Latest safe close would be ${date(safe)}.`}
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5">
              <Receipt
                rows={[
                  { label: "Item", value: `${title} · ${product}` },
                  { label: "Sizes", value: sizes.join(" ") },
                  { label: "Price", value: aud(price) },
                  { label: "Target", value: `${target} fans` },
                  { label: "Opens", value: "After review (within a day)" },
                  { label: "Closes", value: date(close, true) },
                  { label: "Show", value: `${venue} · ${date(showTs)}` },
                  { label: "Printer", value: `${printer} · ${aud(quote)}` },
                ]}
              />
              <label className="flex items-start gap-3 border border-line p-4 text-[13px]">
                <input type="checkbox" className="mt-0.5 size-4 accent-ink" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <span>
                  I agree to the artist terms. Merch Round keeps 10% of what fans pay (card fees included), pays the printer from the round, and pays me the rest
                  after I confirm delivery.
                </span>
              </label>
            </div>
          )}

          <div className="mt-8 flex justify-between border-t border-line pt-5">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              ← Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
                Next →
              </Button>
            ) : (
              <Button variant="lime" onClick={submit} disabled={!canNext}>
                Submit for review
              </Button>
            )}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line bg-card">
            <div className="relative aspect-[5/4] border-b border-line dotgrid">
              <div className="absolute top-3 left-3 label">live preview</div>
              <div className="absolute inset-8">
                <MerchMock {...preview} accent={artist.accent} label={artist.name} />
              </div>
            </div>
            <div className="p-4">
              <div className="label">{artist.name}</div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="font-display text-[20px] font-bold">{title || "Untitled"}</div>
                <div className="font-display text-[18px] font-bold">{aud(price)}</div>
              </div>
              <Tally pledged={0} target={target} accent={artist.accent} size="sm" className="mt-3" />
              <div className="mt-2 text-[12px] text-ash">0 of {target} fans · closes {date(close)}</div>
            </div>
          </div>
          <div className="border border-ink bg-ink p-5 text-paper">
            <div className="text-[11px] uppercase tracking-[0.16em] text-paper/60">what you take home at target</div>
            <Receipt
              className="mt-3 [&_.border-mute\/60]:border-paper/30"
              rows={[
                { label: `Fans pay (${target} × ${aud(price)})`, value: aud(gross, { cents: true }) },
                { label: "Merch Round 10%", value: `−${aud(fee, { cents: true })}` },
                { label: "Printer", value: `−${aud(quote, { cents: true })}` },
              ]}
              total={{ label: "You get", value: <span className="text-lime">{aud(Math.max(0, take), { cents: true })}</span> }}
            />
            <div className="mt-3 text-[12px] text-paper/60">+{aud(price * 0.9, { cents: true })} for every fan past {target}.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
