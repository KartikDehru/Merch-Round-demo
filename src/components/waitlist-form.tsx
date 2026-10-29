"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { DEMO_END, WAITLIST } from "@/lib/copy";
import type { WaitlistRole, WaitlistSource, WouldUse } from "@/lib/waitlist";
import { Button, Field, Input, cx } from "./ui";

type Props = {
  source?: WaitlistSource;
  showFeedback?: boolean;
  className?: string;
  compact?: boolean;
};

export function WaitlistForm({ source = "landing", showFeedback = false, className, compact }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WaitlistRole>("artist");
  const [band, setBand] = useState("");
  const [wouldUse, setWouldUse] = useState<WouldUse | "">("");
  const [blocker, setBlocker] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (showFeedback && !wouldUse) {
      setError("Pick Yes, Maybe, or No.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          role,
          band: band || undefined,
          source,
          feedback: showFeedback && wouldUse ? { wouldUse, blocker: blocker || undefined } : undefined,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className={cx("border border-ink bg-brick-soft p-6 sm:p-8", className)}>
        <h3 className="font-display text-[28px] leading-none sm:text-[36px]">{WAITLIST.sentHeading}</h3>
        <p className="mt-3 max-w-md text-[15px] text-ash">{WAITLIST.sentBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cx("space-y-4", className)}>
      {showFeedback && (
        <div className="space-y-3">
          <fieldset>
            <legend className="label mb-2 block">{DEMO_END.question}</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["yes", "Yes"],
                  ["maybe", "Maybe"],
                  ["no", "No"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setWouldUse(value)}
                  className={cx(
                    "h-10 rounded-[4px] border px-4 text-[14px] font-bold",
                    wouldUse === value ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <Field label={DEMO_END.blockerLabel}>
            <Input value={blocker} onChange={(e) => setBlocker(e.target.value)} placeholder="Price, timing, Stripe…" />
          </Field>
        </div>
      )}

      <div className={cx("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Your name" />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@email.com"
          />
        </Field>
      </div>

      <fieldset>
        <legend className="label mb-2 block">I am</legend>
        <div className="flex flex-wrap gap-2">
          {WAITLIST.roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={cx(
                "h-10 rounded-[4px] border px-3 text-[13px] font-semibold",
                role === r.value ? "border-ink bg-brick text-ink" : "border-line bg-paper text-ash hover:border-ink hover:text-ink",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Band or artist name (optional)">
        <Input value={band} onChange={(e) => setBand(e.target.value)} placeholder="Optional" autoComplete="organization" />
      </Field>

      {error && <p className="text-[14px] text-stop">{error}</p>}

      <Button type="submit" variant="brick" size="lg" disabled={busy} className="w-full sm:w-auto">
        {busy ? "Joining…" : WAITLIST.submit}
      </Button>

      <p className="text-[13px] text-ash">
        We&apos;ll only use your details to tell you when Merch Round opens. Read the{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
