import type { Collection } from "mongodb";
import { getDb, mongoConfigured } from "./mongo";

export type WaitlistRole = "artist" | "fan" | "other";
export type WaitlistSource = "landing" | "demo_end";
export type WouldUse = "yes" | "maybe" | "no";

export type WaitlistDoc = {
  email: string;
  name: string;
  role: WaitlistRole;
  band?: string;
  source: WaitlistSource;
  feedback?: {
    wouldUse: WouldUse;
    blocker?: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type WaitlistInput = {
  name: string;
  email: string;
  role: WaitlistRole;
  band?: string;
  source: WaitlistSource;
  feedback?: {
    wouldUse: WouldUse;
    blocker?: string;
  };
};

async function col(): Promise<Collection<WaitlistDoc>> {
  const db = await getDb();
  return db.collection<WaitlistDoc>("waitlist");
}

export function waitlistReady() {
  return mongoConfigured();
}

export async function upsertWaitlist(input: WaitlistInput): Promise<WaitlistDoc> {
  const now = new Date();
  const email = input.email.trim().toLowerCase();
  const doc: WaitlistDoc = {
    email,
    name: input.name.trim(),
    role: input.role,
    band: input.band?.trim() || undefined,
    source: input.source,
    feedback: input.feedback,
    createdAt: now,
    updatedAt: now,
  };

  const collection = await col();
  const existing = await collection.findOne({ email });
  if (existing) {
    await collection.updateOne(
      { email },
      {
        $set: {
          name: doc.name,
          role: doc.role,
          band: doc.band,
          source: doc.source,
          ...(doc.feedback ? { feedback: doc.feedback } : {}),
          updatedAt: now,
        },
      },
    );
    return { ...existing, ...doc, createdAt: existing.createdAt, updatedAt: now };
  }

  await collection.insertOne(doc);
  return doc;
}

export async function listWaitlist(): Promise<WaitlistDoc[]> {
  const collection = await col();
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}
