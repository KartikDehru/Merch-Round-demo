"use client";

import { useState } from "react";
import { useWorld } from "@/lib/store";
import { connectStripe, updateArtist } from "@/lib/actions";
import { RequireRole } from "@/components/require-role";
import { MerchMock } from "@/components/visuals";
import { Button, Field, H1, Input, Label, Panel, Pill, Textarea, cx } from "@/components/ui";

const ACCENTS = ["#C8452B", "#1D4B4F", "#2F6A84", "#B07D24", "#5B4C7E", "#8E2F45", "#15181C"];

export default function Settings() {
  return (
    <RequireRole role="artist">
      <Inner />
    </RequireRole>
  );
}

function Inner() {
  const { world, act, toast } = useWorld();
  const a = world.artists.find((x) => x.id === world.session.artistId)!;
  const [bio, setBio] = useState(a.bio);
  const [ig, setIg] = useState(a.instagram);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8">
      <Label>profile</Label>
      <H1 className="mt-3">{a.name}</H1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel title="public profile">
          <div className="grid gap-4">
            <Field label="Bio">
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </Field>
            <Field label="Instagram">
              <Input value={ig} onChange={(e) => setIg(e.target.value)} />
            </Field>
            <div>
              <span className="label">accent colour · used on your round pages</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    onClick={() => act(updateArtist(a.id, { accent: c }))}
                    className={cx("size-10 border-2", a.accent === c ? "border-ink ring-2 ring-ink ring-offset-2" : "border-line")}
                    style={{ background: c }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
            <Button
              className="justify-self-start"
              onClick={() => {
                act(updateArtist(a.id, { bio, instagram: ig }));
                toast("Profile saved", "good");
              }}
            >
              Save
            </Button>
          </div>
        </Panel>
        <div className="space-y-6">
          <div className="aspect-square border border-line bg-card p-10 dotgrid">
            <MerchMock product="tee" colorway="black" motif="rings" accent={a.accent} label={a.name} />
          </div>
          <Panel title="payouts · stripe connect">
            <div className="flex items-center justify-between">
              <span className="text-[13px]">Status</span>
              <Pill tone={a.stripe === "verified" ? "good" : "warn"}>{a.stripe === "verified" ? "Payouts enabled" : "Setup needed"}</Pill>
            </div>
            <p className="mt-3 text-[12px] text-ash">Stripe holds your ID and bank details. Merch Round never sees them.</p>
            {a.stripe !== "verified" ? (
              <Button className="mt-4" onClick={() => { act(connectStripe(a.id)); toast("Stripe verified", "good"); }}>Continue to Stripe</Button>
            ) : (
              <Button className="mt-4" variant="secondary" onClick={() => toast("Opens the Stripe Express dashboard (demo)")}>Open Stripe dashboard ↗</Button>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
