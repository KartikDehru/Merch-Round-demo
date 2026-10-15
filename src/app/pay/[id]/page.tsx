"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import { confirmAuth } from "@/lib/actions";
import { aud, dateTime } from "@/lib/format";
import { MerchMock } from "@/components/visuals";
import { Button, Label, Stamp } from "@/components/ui";

export default function PayPage() {
  const { id } = useParams<{ id: string }>();
  const { world, act, toast } = useWorld();
  const router = useRouter();
  const [bank, setBank] = useState(false);
  const p = world.pledges.find((x) => x.id === id);
  if (!p) return null;
  const r = world.rounds.find((x) => x.id === p.roundId)!;
  const a = world.artists.find((x) => x.id === r.artistId)!;

  if (p.status !== "action_required")
    return (
      <div className="mx-auto max-w-[520px] px-5 py-24 text-center">
        {["paid", "fulfilled"].includes(p.status) ? <Stamp tone="go">Paid</Stamp> : <div className="font-display text-[32px] text-ash">Nothing to pay</div>}
        <p className="mt-6 text-ash">This payment doesn&apos;t need anything from you.</p>
        <Link href={`/o/${p.id}`} className="mt-4 inline-block underline">View order</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-[560px] px-5 py-12">
      <div className="border-l-4 border-hold bg-hold-soft p-4 text-[13px]">
        Your bank needs you to confirm the <b>{aud(p.amount)}</b> payment for {a.name}&apos;s {r.title}.
        {r.chargeDeadline && <> You have until <b>{dateTime(r.chargeDeadline)}</b>.</>}
      </div>
      <div className="mt-6 border-t-[6px] border-brick bg-card p-6">
        <div className="flex gap-4">
          <div className="size-20 shrink-0 border border-line dotgrid">
            <MerchMock product={r.product} colorway={r.colorway} motif={r.motif} accent={a.accent} />
          </div>
          <div>
            <Label>{a.name}</Label>
            <div className="font-display text-[20px] font-bold">{r.title}</div>
            <div className="text-[13px] text-ash">Size {p.size} · {p.card.brand} •••• {p.card.last4}</div>
          </div>
        </div>
        <Button variant="brick" size="lg" className="mt-6 w-full" onClick={() => setBank(true)}>
          Confirm {aud(p.amount, { cents: true })}
        </Button>
        <p className="mt-3 text-center text-[11px] text-mute">Secured by Stripe · 3-D Secure</p>
      </div>

      {bank && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-5 backdrop-blur-sm">
          <div className="animate-rise w-full max-w-[380px] border-2 border-ink bg-card p-6 text-center">
            <div className="label">demo bank · secure check</div>
            <div className="mt-3 font-display text-[22px] font-bold">Approve {aud(p.amount, { cents: true })} to Merch Round?</div>
            <p className="mt-2 text-[13px] text-ash">Card •••• {p.card.last4}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setBank(false)}>Not now</Button>
              <Button
                variant="brick"
                onClick={() => {
                  act(confirmAuth(p.id));
                  toast("Paid. You're all set.", "good");
                  router.push(`/o/${p.id}`);
                }}
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
