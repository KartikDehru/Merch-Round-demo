export async function sendWaitlistConfirmation(to: string, name: string): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim() || "Merch Round <hello@merchround.com>";
  if (!key) {
    return { sent: false, error: "RESEND_API_KEY is not set" };
  }

  const first = name.trim().split(/\s+/)[0] || "there";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "You're on the Merch Round list",
      html: `
        <p>Hi ${escapeHtml(first)},</p>
        <p>You're on the Merch Round waitlist. We'll email you when it opens — no spam, just the invite.</p>
        <p>Know before you print.<br/>Merch Round</p>
      `,
      text: `Hi ${first},\n\nYou're on the Merch Round waitlist. We'll email you when it opens — no spam, just the invite.\n\nKnow before you print.\nMerch Round`,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { sent: false, error: body || `Resend ${res.status}` };
  }
  return { sent: true };
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
