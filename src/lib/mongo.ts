import { createRequire } from "node:module";
import { SEED_VERSION, createSeed } from "./seed";
import type { World } from "./types";
import type { Collection, MongoClient } from "mongodb";

const nodeRequire = createRequire(`${process.cwd()}/package.json`);

function loadDriver(): { MongoClient: new (uri: string) => MongoClient } {
  const spec = "mongodb";
  return nodeRequire(spec);
}

export type SharedWorld = Omit<World, "session">;

type WorldDoc = {
  _id: "demo";
  rev: number;
  version: number;
  world: SharedWorld;
};

let client: MongoClient | undefined;
let connectPromise: Promise<MongoClient> | undefined;

function connectionUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  const host = process.env.MONGODB_HOST?.trim();
  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  if (!host || !user || !password) return undefined;
  const db = process.env.MONGODB_DB || "merchround";
  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${db}?retryWrites=true&w=majority`;
}

export function mongoConfigured() {
  return Boolean(connectionUri());
}

async function getClient() {
  const uri = connectionUri();
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (client) return client;
  if (!connectPromise) {
    const { MongoClient: Client } = loadDriver();
    const next = new Client(uri);
    connectPromise = next.connect().then(
      (c) => {
        client = c;
        return c;
      },
      (error) => {
        connectPromise = undefined;
        throw error;
      },
    );
  }
  return connectPromise;
}

async function collection(): Promise<Collection<WorldDoc>> {
  const db = (await getClient()).db(process.env.MONGODB_DB || "merchround");
  return db.collection<WorldDoc>("world");
}

function sharedFrom(world: World): SharedWorld {
  const copy = { ...world } as Partial<World>;
  delete copy.session;
  return copy as SharedWorld;
}

export async function readSharedWorld(): Promise<{ rev: number; world: SharedWorld }> {
  const col = await collection();
  const existing = await col.findOne({ _id: "demo" });
  if (existing && existing.version === SEED_VERSION && existing.world) {
    return { rev: existing.rev, world: existing.world };
  }
  const world = sharedFrom(createSeed());
  await col.updateOne(
    { _id: "demo" },
    { $set: { rev: 1, version: SEED_VERSION, world } },
    { upsert: true },
  );
  return { rev: 1, world };
}

export async function writeSharedWorld(world: SharedWorld): Promise<{ rev: number }> {
  const col = await collection();
  const updated = await col.findOneAndUpdate(
    { _id: "demo" },
    { $set: { world, version: SEED_VERSION }, $inc: { rev: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return { rev: updated?.rev ?? 1 };
}

export async function resetSharedWorld(): Promise<{ rev: number; world: SharedWorld }> {
  const world = sharedFrom(createSeed());
  const col = await collection();
  const updated = await col.findOneAndUpdate(
    { _id: "demo" },
    { $set: { world, version: SEED_VERSION }, $inc: { rev: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return { rev: updated?.rev ?? 1, world };
}
