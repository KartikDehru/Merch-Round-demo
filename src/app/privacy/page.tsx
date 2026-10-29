import Link from "next/link";
import { SITE } from "@/lib/copy";

export const metadata = {
  title: "Privacy — Merch Round",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-8 sm:py-24">
      <p className="label">Legal</p>
      <h1 className="mt-2 font-display text-[clamp(32px,5vw,48px)] leading-none">Privacy policy</h1>
      <p className="mt-6 text-[16px] leading-relaxed text-ash">
        Merch Round ({SITE.domain}) is not open to the public yet. If you join the waitlist or leave demo
        feedback, we store your name, email, role, optional band name, and any answers you give so we can
        invite you when the product launches and understand what would stop you from using it.
      </p>
      <p className="mt-4 text-[16px] leading-relaxed text-ash">
        We will not sell your details. Confirmation emails are sent only about Merch Round access. A full
        privacy policy is being written with our lawyer and will replace this stub before launch.
      </p>
      <p className="mt-4 text-[16px] leading-relaxed text-ash">
        Questions:{" "}
        <a className="underline" href="mailto:hello@merchround.com">
          hello@merchround.com
        </a>
        .
      </p>
      <p className="mt-10">
        <Link href="/" className="font-semibold underline underline-offset-4">
          Back home
        </Link>
      </p>
    </div>
  );
}
