"use client";

import { useWorld } from "@/lib/store";
import { login } from "@/lib/actions";
import type { Role } from "@/lib/types";
import { Button, H1, Label } from "./ui";

const COPY: Record<Role, { title: string; who: string }> = {
  fan: { title: "Fan area", who: "Sam Taylor" },
  artist: { title: "Merch Round example", who: "Merch Round" },
  admin: { title: "Merch Round admin", who: "Priya · Ops" },
};

export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const { world, act } = useWorld();
  if (world.session.role === role) return <>{children}</>;
  return (
    <div className="mx-auto max-w-[560px] px-5 py-24 text-center">
      <Label>{role} only</Label>
      <H1 className="mt-3">{COPY[role].title}</H1>
      <p className="mt-3 text-ash">
        {role === "artist" ? "Artists sign in with a magic link." : role === "admin" ? "Admins sign in with a magic link and a role check." : ""} In the
        demo, one click.
      </p>
      <Button variant="brick" size="lg" className="mt-6" onClick={() => act(login(role))}>
        Sign in as {role === "artist" ? world.artists.find((a) => a.id === world.session.artistId)?.name : COPY[role].who}
      </Button>
    </div>
  );
}
