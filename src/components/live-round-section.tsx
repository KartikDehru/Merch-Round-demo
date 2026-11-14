import Image from "next/image";
import type { ReactNode } from "react";
import { LIVE } from "@/lib/copy";
import { ScaleToFit } from "./scale-to-fit";
import { Logo } from "./visuals";
import { cx } from "@/lib/cx";

/** "Your round is live" band: dashboard, Instagram post and email, as in the Figma composite. */
export function LiveRoundSection() {
  return (
    <section className="bg-stone">
      <div className="mx-auto max-w-[1265px] px-5 pb-14 pt-12 sm:px-12 sm:pb-[78px] sm:pt-[66px]">
        <h2 className="mx-auto max-w-[300px] text-center font-display text-[30px] leading-[1.15] sm:max-w-none sm:text-[42px]">
          {LIVE.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-[320px] text-center text-[16px] font-light text-ash sm:mt-5 sm:max-w-none sm:text-[18px]">
          {LIVE.body}
        </p>

        <div className="mt-10 hidden sm:block">
          <ScaleToFit width={1075} height={505}>
            <Dashboard className="absolute left-0 top-[63px]" />
            <InstagramPost className="absolute left-[590px] top-0" />
            <EmailCard className="absolute left-[810px] top-[179px]" />
          </ScaleToFit>
        </div>
        <div className="mt-9 sm:hidden">
          <ScaleToFit width={760} height={550}>
            <Dashboard className="absolute left-0 top-[60px]" />
            <InstagramPost className="absolute left-[535px] top-0" />
            <EmailCard className="absolute left-[477px] top-[252px]" />
          </ScaleToFit>
        </div>
      </div>
    </section>
  );
}

const shadow = "shadow-[0_8px_30px_rgba(17,17,17,0.12)]";

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-brick bg-brick-soft px-2 py-[3px] text-[6.5px] font-bold uppercase tracking-[0.14em]">
      {children}
    </span>
  );
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-[8px] border border-ink/10 bg-paper", className)}>{children}</div>;
}

const ORDERS = [
  ["Sam T.", "M"],
  ["Jess R.", "S"],
  ["Tom K.", "L"],
  ["Mia P.", "M"],
  ["Dan W.", "XL"],
  ["Alex B.", "M"],
] as const;

function Dashboard({ className }: { className?: string }) {
  return (
    <div className={cx("w-[595px] overflow-hidden rounded-[10px] bg-[#f7f7f5] text-ink", shadow, className)}>
      <div className="flex h-[40px] items-center justify-between border-b border-ink/10 bg-paper px-4">
        <Logo size={18} />
        <span className="rounded-[3px] bg-brick px-2 py-[3px] text-[8px] font-bold">Live</span>
      </div>
      <div className="grid grid-cols-[177px_1fr] gap-[14px] p-[14px]">
        <div className="space-y-[12px]">
          <Card className="overflow-hidden">
            <div className="relative h-[127px] bg-ink">
              <Image src="/figma/tee-price-of-art.jpg" alt="" fill className="object-contain" sizes="180px" />
            </div>
            <div className="px-3 pb-6 pt-4">
              <p className="text-[13px] font-extrabold">The Price of Art</p>
              <p className="mt-3 text-[9px] text-ash">A$55 · Collect or dispatch</p>
            </div>
          </Card>
          <Card className="px-3 pb-3 pt-3.5">
            <p className="text-[6.5px] font-bold uppercase tracking-[0.12em] text-ash">Share the link</p>
            <p className="mt-2 rounded-[3px] bg-stone px-2 py-2 text-[8.5px]">merchround.com/r/price-of-art</p>
            <p className="mt-2 rounded-[3px] bg-brick py-2 text-center text-[9px] font-bold">Copy link</p>
            <p className="mt-4 text-[6.5px] font-bold uppercase tracking-[0.12em] text-ash">Latest</p>
            <p className="mt-1.5 text-[8px]">Sam T. asked for a tee (M)</p>
            <p className="text-[7px] text-ash">2 min ago</p>
          </Card>
        </div>

        <div className="space-y-[12px]">
          <Card className="px-3.5 py-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-extrabold">17 of 25 asked for</p>
              <Chip>Progress</Chip>
            </div>
            <div className="mt-4 h-[9px] overflow-hidden rounded-full bg-[#e4e4e0]">
              <div className="h-full w-[68%] rounded-full bg-brick" />
            </div>
            <div className="mt-2.5 flex justify-between text-[8.5px]">
              <span className="text-ash">8 more to go · 5 days 19 hours left</span>
              <span className="font-bold">If 25 fans buy, you get A$337.50</span>
            </div>
          </Card>
          <Card className="px-3.5 pb-1 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-extrabold">Orders so far</p>
              <Chip>Fulfilment</Chip>
            </div>
            <p className="mt-1 text-[8.5px] text-ash">The Servo, Port Kembla · 24 Nov</p>
            <p className="mt-2.5 rounded-[4px] bg-stone px-2.5 py-2 text-[8.5px] font-bold">Sizes so far: S 3 · M 8 · L 4 · XL 2</p>
            <div className="mt-3 grid grid-cols-[1fr_92px_44px_58px] pb-2 text-[6.5px] font-bold uppercase tracking-[0.08em] text-ash">
              <span>Name</span>
              <span>Item</span>
              <span>Size</span>
              <span>Asked for</span>
            </div>
            {ORDERS.map(([name, size]) => (
              <div
                key={name}
                className="grid h-[26px] grid-cols-[1fr_92px_44px_58px] items-center border-t border-ink/10 text-[9px]"
              >
                <span className="font-bold">{name}</span>
                <span>Tee</span>
                <span>{size}</span>
                <span className="ml-5 size-[11px] rounded-[2px] border border-ink/20" />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function InstagramPost({ className }: { className?: string }) {
  return (
    <div className={cx("w-[225px] overflow-hidden rounded-[4px] bg-paper text-ink", shadow, className)}>
      <div className="flex h-[44px] items-center gap-2 px-2.5">
        <span className="rounded-full bg-[conic-gradient(#f9ce34,#ee2a7b,#6228d7,#f9ce34)] p-[2px]">
          <span className="block size-[22px] rounded-full border-2 border-paper bg-ink" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[9.5px] font-semibold">One Volume</p>
          <p className="text-[8px]">Wollongong, New South Wales</p>
        </div>
        <span className="text-[12px] font-bold leading-none tracking-[1px]">···</span>
      </div>
      <div className="relative h-[181px] bg-ink">
        <Image src="/figma/tee-price-of-art.jpg" alt="" fill className="object-contain" sizes="230px" />
        <span className="absolute right-2 top-2">
          <Chip>Promotion</Chip>
        </span>
      </div>
      <div className="px-2.5 pb-2.5 pt-2">
        <div className="flex items-center gap-2.5">
          <IgIcon d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
          <IgIcon d="M5 18.5 6.2 15A7 7 0 1 1 9 17.8Z" />
          <IgIcon d="M20 4 4 10.5l6.5 2.5L13 19.5Z M10.5 13 20 4" />
          <span className="flex-1" />
          <IgIcon d="M7 4h10v16l-5-4-5 4Z" />
        </div>
        <p className="mt-2 text-[9px] font-bold">132 likes</p>
        <p className="mt-0.5 text-[9px] leading-[1.35]">
          <span className="font-semibold">Onevolume</span> The Price of Art is up for a few days. You&apos;re only charged if the
          round goes ahead. Link in bio.
        </p>
        <p className="mt-1.5 text-[9px] text-ash">View all 37 comments</p>
        <p className="mt-1 text-[6.5px] uppercase text-ash">2 hours ago</p>
      </div>
    </div>
  );
}

function IgIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function EmailCard({ className }: { className?: string }) {
  return (
    <div className={cx("w-[263px] overflow-hidden rounded-[6px] bg-paper text-ink", shadow, className)}>
      <div className="flex h-[18px] items-center justify-between bg-[#f1f1ee] px-2">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-[5px] rounded-full bg-ink/20" />
          ))}
        </span>
        <span className="text-[7px] text-ash">Inbox</span>
      </div>
      <div className="px-2.5 pb-2.5 pt-2.5">
        <div className="flex items-start gap-2">
          <span className="flex size-[20px] items-center justify-center rounded-full bg-ink text-[8px] font-bold text-brick">Y</span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[9px] font-semibold">One Volume</p>
            <p className="text-[7.5px] text-ash">hello@onevolume.com</p>
          </div>
          <span className="text-[7.5px] text-ash">9:14 am</span>
        </div>
        <p className="mt-2.5 border-b border-ink/10 pb-2 text-[10.5px] font-bold">The Price of Art is up. We need 25.</p>
        <div className="mt-2 overflow-hidden rounded-[3px] bg-stone">
          <div className="relative h-[82px] bg-ink">
            <Image src="/figma/tee-price-of-art.jpg" alt="" fill className="object-contain" sizes="250px" />
          </div>
          <div className="px-2.5 pb-2.5 pt-2">
            <p className="text-[9.5px] font-extrabold">Our new drop has arrived. Join the Round.</p>
            <p className="mt-1 text-[7.5px] leading-snug text-ash">
              The Price of Art available now, come join and let&apos;s get these out in the world.
            </p>
            <p className="mt-2 w-[112px] rounded-[2px] bg-brick py-1.5 text-center text-[8px] font-bold">Let&apos;s Go</p>
          </div>
        </div>
        <p className="mt-2 text-[6.5px] leading-snug text-ash">
          You are getting this because you joined the onevolume mailing list. Unsubscribe any time.
        </p>
      </div>
    </div>
  );
}
