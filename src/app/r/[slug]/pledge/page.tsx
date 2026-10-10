"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useWorld } from "@/lib/store";
import { createPledge, login, uid } from "@/lib/actions";
import { DEMO_FAN } from "@/lib/domain";
import { aud, date } from "@/lib/format";
import { Receipt, useRound } from "@/components/round-bits";
import { MerchMock } from "@/components/visuals";
import { Button, Field, H1, Input, Label, cx } from "@/components/ui";

export default function PledgePage() {
  return (
    <Suspense>
      <Pledge />
    </Suspense>
  );
}

function Pledge() {
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const { round, artist } = useRound(slug);
  const { act, toast, world } = useWorld();
  const router = useRouter();
  const [pickedSize, setSize] = useState<string>(() => search.get("size") ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<"form" | "saving" | "3ds">("form");

  if (!round || !artist) return null;
  const size = round.sizes.includes(pickedSize) ? pickedSize : round.sizes.includes("M") ? "M" : round.sizes[0];
  if (round.status !== "live")
    return (
      <div className="mx-auto max-w-[640px] px-5 py-24 text-center">
        <div className="font-pixel text-2xl text-mute">closed_</div>
        <p className="mt-3 text-ash">This round isn&apos;t taking pledges.</p>
        <Link className="mt-6 inline-block underline" href={`/r/${round.slug}`}>Back to round</Link>
      </div>
    );

  const amount = round.price + (method === "delivery" ? round.deliveryFee : 0);
  const digits = card.replace(/\D/g, "");
  const valid = name.trim() && /\S+@\S+\.\S+/.test(email) && digits.length >= 15 && exp.length >= 4 && cvc.length >= 3 && (method === "pickup" || address.trim());

  const autofill = () => {
    setName(DEMO_FAN.name);
    setEmail(DEMO_FAN.email);
    setCard("4242 4242 4242 4242");
    setExp("12 / 29");
    setCvc("123");
    setAddress("4/18 Crown St, Wollongong NSW 2500");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setStep(digits.endsWith("3155") ? "3ds" : "saving");
    if (!digits.endsWith("3155")) finish();
  };

  const finish = () => {
    const id = uid("p");
    setTimeout(() => {
      const isSam = email.trim().toLowerCase() === DEMO_FAN.email;
      act(
        ...(isSam ? [login("fan")] : []),
        createPledge(round.id, {
          id,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          size,
          fulfilment: method,
          address: method === "delivery" ? address : undefined,
          last4: digits.slice(-4),
          brand: digits.startsWith("5") ? "Mastercard" : digits.startsWith("3") ? "Amex" : "Visa",
        }),
      );
      toast("Card saved. You're in.", "good");
      router.push(`/o/${id}?new=1`);
    }, 1100);
  };

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
      <Link href={`/r/${round.slug}`} className="label hover:text-ink">← back to round</Link>
      <H1 className="mt-3">Your pledge.</H1>
      <p className="mt-2 text-ash">No account needed. Nothing is charged today.</p>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-8">
          <section className="border border-line bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <Label>01 / your details</Label>
              <button type="button" onClick={autofill} className="text-[12px] uppercase tracking-[0.14em] text-go underline decoration-2 underline-offset-4">
                autofill demo fan
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sam Taylor" autoComplete="name" required />
              </Field>
              <Field label="Email" hint="Your order link and ticket go here.">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" required />
              </Field>
            </div>
            {round.sizes.length > 1 && (
              <div className="mt-5">
                <span className="label">size</span>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {round.sizes.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSize(s)}
                      className={cx("h-11 border font-display text-[15px] font-bold", size === s ? "border-ink bg-ink text-paper" : "border-line hover:border-ink")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="border border-line bg-card p-5 sm:p-6">
            <Label>02 / how to get it</Label>
            <div className="mt-4 grid gap-3">
              {(
                [
                  ["pickup", `Pick up at the show`, `${round.venue} · ${date(round.showDate)}`, "Free"],
                  ...(round.delivery ? [["delivery", "Post it to me", "Australia-wide, after printing", `+${aud(round.deliveryFee)}`]] : []),
                ] as [("pickup" | "delivery"), string, string, string][]
              ).map(([v, t, s, p]) => (
                <label key={v} className={cx("flex cursor-pointer items-center gap-3 border p-4 transition", method === v ? "border-ink bg-lime-soft" : "border-line hover:border-ink")}>
                  <input type="radio" name="method" className="accent-ink" checked={method === v} onChange={() => setMethod(v)} />
                  <span className="flex-1">
                    <span className="block font-display text-[16px] font-bold">{t}</span>
                    <span className="block text-[12px] text-ash">{s}</span>
                  </span>
                  <span className="text-[13px]">{p}</span>
                </label>
              ))}
              {method === "delivery" && (
                <Field label="Delivery address">
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, suburb, state, postcode" />
                </Field>
              )}
            </div>
          </section>

          <section className="border border-line bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <Label>03 / card</Label>
              <span className="text-[11px] uppercase tracking-[0.14em] text-mute">stripe · test mode</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2">
              <button type="button" onClick={autofill} className="h-11 bg-ink text-[13px] text-paper"> Pay</button>
              <button type="button" onClick={autofill} className="h-11 border border-ink text-[13px]">G Pay</button>
            </div>
            <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-mute">
              <span className="h-px flex-1 bg-line" />
              or card
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="border border-line">
              <input
                value={card}
                onChange={(e) => setCard(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))}
                placeholder="Card number"
                inputMode="numeric"
                className="h-11 w-full border-b border-line bg-card px-3 tabular focus:outline-none"
              />
              <div className="grid grid-cols-2">
                <input value={exp} onChange={(e) => setExp(e.target.value.slice(0, 7))} placeholder="MM / YY" className="h-11 border-r border-line bg-card px-3 focus:outline-none" />
                <input value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVC" className="h-11 bg-card px-3 focus:outline-none" />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-mute">
              Test cards: <code>4242 4242 4242 4242</code> saves instantly · <code>4000 0025 0000 3155</code> asks for 3-D Secure.
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border-2 border-ink bg-card p-5 shadow-[6px_6px_0_var(--color-ink)]">
            <div className="flex gap-4">
              <div className="size-24 shrink-0 border border-line dotgrid">
                <MerchMock product={round.product} colorway={round.colorway} motif={round.motif} accent={artist.accent} />
              </div>
              <div>
                <div className="label">{artist.name}</div>
                <div className="font-display text-[18px] leading-tight font-bold">{round.title}</div>
                <div className="mt-1 text-[13px] text-ash">Size {size} · {method === "pickup" ? "pick up" : "delivery"}</div>
              </div>
            </div>
            <Receipt
              className="mt-5"
              rows={[
                { label: `${round.product === "tee" ? "Tee" : round.title} (${size})`, value: aud(round.price, { cents: true }) },
                ...(method === "delivery" ? [{ label: "Delivery", value: aud(round.deliveryFee, { cents: true }) }] : []),
                { label: "Fees", value: "A$0.00", muted: true },
                { label: "Charged on", value: date(round.closesAt, true), muted: true },
                { label: "Only if", value: `${round.target} fans pledge`, muted: true },
              ]}
              total={{ label: "If it hits", value: aud(amount, { cents: true }) }}
            />
            <Button type="submit" variant="lime" size="lg" className="mt-5 w-full" disabled={!valid || busy}>
              {busy ? "Saving card…" : "Save card & pledge"}
            </Button>
            <p className="mt-3 text-[11px] leading-relaxed text-ash">
              By pledging you authorise Merch Round to charge {aud(amount, { cents: true })} to this card on or after {date(round.closesAt, true)} if
              this round reaches {round.target} orders. If it doesn&apos;t, you won&apos;t be charged. You can cancel until then.
            </p>
          </div>
          <p className="mt-4 text-center text-[12px] text-mute">
            {world.pledges.filter((p) => p.roundId === round.id && p.status === "pledged").length} fans already in
          </p>
        </aside>
      </form>

      {step !== "form" && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-5 backdrop-blur-sm">
          <div className="animate-rise w-full max-w-[380px] border-2 border-ink bg-card p-6 text-center">
            {step === "saving" ? (
              <>
                <div className="font-pixel text-xl">saving card<span className="animate-blink">_</span></div>
                <p className="mt-2 text-[13px] text-ash">Stripe SetupIntent · no charge</p>
              </>
            ) : (
              <>
                <div className="label">your bank · 3-D Secure</div>
                <div className="mt-3 font-display text-[22px] font-bold">Approve saving this card?</div>
                <p className="mt-2 text-[13px] text-ash">Demo Bank wants to confirm card •••• {digits.slice(-4)} can be charged later by Merch Round.</p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={() => { setStep("form"); setBusy(false); toast("Card not saved", "bad"); }}>Decline</Button>
                  <Button variant="lime" onClick={() => { setStep("saving"); finish(); }}>Approve</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
