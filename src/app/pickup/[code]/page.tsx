import Link from "next/link";
import { Pill } from "@/components/ui";

export default async function PickupPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const pretty = code.toUpperCase().replace(/^MR/, "MR ");

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <Pill tone="live">Demo pickup</Pill>
      <h1 className="mt-4 font-display text-[36px] leading-none">Order {pretty}</h1>
      <p className="mt-4 text-[15px] text-ash">
        In the live product, scanning this code opens the artist handover screen (name, item, size, Handed over). That scanner is still a Gap — this page is a stub so the QR has somewhere to land.
      </p>
      <dl className="mt-8 space-y-3 border border-line p-4 text-[14px]">
        <div className="flex justify-between">
          <dt className="text-ash">Fan</dt>
          <dd className="font-semibold">Sam Taylor</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ash">Item</dt>
          <dd className="font-semibold">Merch Round Tee · M</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ash">Status</dt>
          <dd className="font-semibold">Ready for pickup</dd>
        </div>
      </dl>
      <p className="mt-8">
        <Link href="/" className="font-semibold underline underline-offset-4">
          Back home
        </Link>
      </p>
    </div>
  );
}
