import { mongoConfigured, readSharedWorld, resetSharedWorld, writeSharedWorld, type SharedWorld } from "@/lib/mongo";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!mongoConfigured()) {
    return Response.json({ error: "MongoDB is not configured" }, { status: 503 });
  }
  try {
    const data = await readSharedWorld();
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return Response.json({ error: message }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!mongoConfigured()) {
    return Response.json({ error: "MongoDB is not configured" }, { status: 503 });
  }
  try {
    const body = (await request.json()) as { world?: SharedWorld; reset?: boolean };
    if (body.reset) {
      const data = await resetSharedWorld();
      return Response.json(data);
    }
    if (!body.world?.rounds || !body.world.artists) {
      return Response.json({ error: "Missing world" }, { status: 400 });
    }
    const saved = await writeSharedWorld(body.world);
    return Response.json(saved);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return Response.json({ error: message }, { status: 503 });
  }
}
