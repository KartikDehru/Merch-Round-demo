import { NextResponse } from "next/server";
import { listWaitlist, waitlistReady } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const key = process.env.WAITLIST_EXPORT_KEY?.trim();
  if (!key) {
    return NextResponse.json({ error: "Export is not configured." }, { status: 503 });
  }

  const url = new URL(req.url);
  const provided = url.searchParams.get("key") || req.headers.get("x-export-key") || "";
  if (provided !== key) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!waitlistReady()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const rows = await listWaitlist();
  const format = url.searchParams.get("format") || "csv";

  if (format === "json") {
    return NextResponse.json({ count: rows.length, rows });
  }

  const header = ["email", "name", "role", "band", "source", "wouldUse", "blocker", "createdAt", "updatedAt"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.email,
        r.name,
        r.role,
        r.band ?? "",
        r.source,
        r.feedback?.wouldUse ?? "",
        r.feedback?.blocker ?? "",
        r.createdAt.toISOString(),
        r.updatedAt.toISOString(),
      ]
        .map(csvEscape)
        .join(","),
    );
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="merchround-waitlist.csv"',
    },
  });
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
