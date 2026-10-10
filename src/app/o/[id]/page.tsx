"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useWorld } from "@/lib/store";
import { reportIssue, uid, updateCard, withdrawPledge } from "@/lib/actions";
import { aud, date } from "@/lib/format";
import { FanTimeline, Receipt, Ticket } from "@/components/round-bits";
import { Button, Field, H1, Input, Panel, PledgePill, Select, Textarea } from "@/components/ui";

export default function OrderPage() {
  return (
    <Suspense>
      <Order />
    </Suspense>
  );
}

function Order() {
  const { id } = useParams<{ id: string }>();
  const fresh = useSearchParams().has("new");
  const { world, act, toast } = useWorld();
  const [cardOpen, setCardOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [newCard, setNewCard] = useState("");
  const [issueType, setIssueType] = useState<"faulty" | "not_received" | "wrong_size" | "other">("faulty");
  const [issueText, setIssueText] = useState("");

  const p = world.pledges.find((x) => x.id === id);
  if (!p)
    return (
      <div className="mx-auto max-w-[560px] px-5 py-24 text-center">
        <div className="font-pixel text-2xl text-mute">order not found_</div>
        <Link className="mt-4 inline-block underline" href="/me">My orders</Link>
      </div>
    );
  const r = world.rounds.find((x) => x.id === p.roundId)!;
  const a = world.artists.find((x) => x.id === r.artistId)!;
  const issue = world.issues.find((i) => i.pledgeId === p.id);
  const first = p.name.split(" ")[0];

  const headline: Record<string, string> = {
    pledged: fresh ? `You're in, ${first}.` : "Pledged. Nothing charged yet.",
    paid: "Paid. It's happening.",
    fulfilled: "Collected. Enjoy it.",
    action_required: "Your bank needs a quick yes.",
    card_update_required: "Your card didn't work.",
    retry_scheduled: "We'll retry your card.",
    released: "Not this time. Not charged.",
    withdrawn: "Pledge cancelled.",
    unpaid: "Your pledge lapsed.",
    refunded: "Refunded.",
  };

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
      <Link href="/me" className="label hover:text-ink">← my orders</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <PledgePill status={p.status} />
        <span className="text-[12px] text-mute">order {p.code}</span>
      </div>
      <H1 className="mt-3">{headline[p.status]}</H1>
      {p.status === "pledged" && (
        <p className="mt-3 max-w-[620px] text-ash">
          You&apos;ll only be charged <b className="text-ink">{aud(p.amount)}</b> on <b className="text-ink">{date(r.closesAt, true)}</b> if {r.title} reaches{" "}
          {r.target}. We&apos;ll email you before charging.
        </p>
      )}

      {p.status === "action_required" && (
        <Link href={`/pay/${p.id}`} className="mt-5 inline-flex h-12 items-center border border-ink bg-lime px-6 text-[13px] uppercase tracking-[0.14em] hover:shadow-[3px_3px_0_var(--color-ink)]">
          Confirm {aud(p.amount)} payment →
        </Link>
      )}
      {p.status === "card_update_required" && (
        <Button variant="lime" size="lg" className="mt-5" onClick={() => setCardOpen(true)}>
          Add a new card →
        </Button>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-8">
          <Ticket round={r} artist={a} pledge={p} />

          <Panel title="share · help it hit the number">
            <div className="flex flex-wrap items-center gap-3">
              <code className="flex-1 truncate border border-line bg-paper px-3 py-2 text-[12px]">merchround.com.au/r/{r.slug}</code>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(`https://merchround.com.au/r/${r.slug}`);
                  toast("Link copied", "good");
                }}
              >
                Copy link
              </Button>
              <Button variant="secondary" size="sm" onClick={() => toast("Story image generated (demo)", "good")}>
                Story image
              </Button>
            </div>
          </Panel>

          <Panel title="manage">
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => setCardOpen((o) => !o)} disabled={!["pledged", "card_update_required", "retry_scheduled"].includes(p.status)}>
                Change card
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={p.status !== "pledged" || r.status !== "live"}
                onClick={() => {
                  if (confirm("Cancel your pledge? Your card will be removed.")) {
                    act(withdrawPledge(p.id));
                    toast("Pledge cancelled", "neutral");
                  }
                }}
              >
                Cancel pledge
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setIssueOpen((o) => !o)} disabled={!["paid", "fulfilled"].includes(p.status) || !!issue}>
                Report a problem
              </Button>
            </div>
            {cardOpen && (
              <div className="mt-4 flex gap-2 border-t border-dashed border-line pt-4">
                <Input placeholder="New card number (try 4242 4242 4242 4242)" value={newCard} onChange={(e) => setNewCard(e.target.value)} />
                <Button
                  variant="lime"
                  onClick={() => {
                    const d = newCard.replace(/\D/g, "");
                    if (d.length < 15) return toast("Enter a full card number", "warn");
                    act(updateCard(p.id, d.slice(-4)));
                    setCardOpen(false);
                    toast(p.status === "pledged" ? "Card updated" : "Paid with new card", "good");
                  }}
                >
                  Save
                </Button>
              </div>
            )}
            {issueOpen && (
              <div className="mt-4 grid gap-3 border-t border-dashed border-line pt-4">
                <Field label="What's wrong?">
                  <Select value={issueType} onChange={(e) => setIssueType(e.target.value as typeof issueType)}>
                    <option value="faulty">Faulty or damaged</option>
                    <option value="not_received">Didn&apos;t receive it</option>
                    <option value="wrong_size">Wrong size</option>
                    <option value="other">Something else</option>
                  </Select>
                </Field>
                <Field label="Tell us more">
                  <Textarea value={issueText} onChange={(e) => setIssueText(e.target.value)} placeholder="The print is peeling on the back…" />
                </Field>
                <Button
                  onClick={() => {
                    act(reportIssue({ id: uid("i"), pledgeId: p.id, roundId: r.id, type: issueType, text: issueText || "No details given" }));
                    setIssueOpen(false);
                    toast("Report sent. We'll sort it.", "good");
                  }}
                >
                  Send report
                </Button>
              </div>
            )}
            {issue && (
              <div className="mt-4 border-t border-dashed border-line pt-4 text-[13px]">
                <span className="label mr-2">your report</span>
                {issue.type.replace("_", " ")} · <b>{issue.status}</b>
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-8">
          <Panel title="status">
            <FanTimeline round={r} pledge={p} />
          </Panel>
          <Panel title="receipt">
            <Receipt
              rows={[
                { label: `${r.title} (${p.size})`, value: aud(r.price, { cents: true }) },
                ...(p.fulfilment === "delivery" ? [{ label: "Delivery", value: aud(r.deliveryFee, { cents: true }) }] : []),
                { label: "Card", value: `${p.card.brand} •••• ${p.card.last4}`, muted: true },
                { label: "Attempts", value: String(p.attempts), muted: true },
                ...(p.declineReason ? [{ label: "Last result", value: p.declineReason, muted: true }] : []),
              ]}
              total={{
                label: p.status === "refunded" ? "Refunded" : ["paid", "fulfilled"].includes(p.status) ? "Paid" : ["released", "withdrawn", "unpaid"].includes(p.status) ? "Charged" : "If it hits",
                value: ["released", "withdrawn", "unpaid"].includes(p.status) ? "A$0.00" : aud(p.amount, { cents: true }),
              }}
            />
          </Panel>
          <Link href={`/r/${r.slug}`} className="block text-center text-[12px] uppercase tracking-[0.14em] text-ash underline underline-offset-4">
            View round page
          </Link>
        </div>
      </div>
    </div>
  );
}
