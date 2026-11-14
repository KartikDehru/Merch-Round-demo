import { COSTS } from "@/lib/copy";

/** Figma "What it costs": three columns under a black top rule. */
export function CostsSection() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1265px] px-5 pb-14 pt-12 sm:px-12 sm:pb-[120px] sm:pt-[40px]">
        <h2 className="text-center font-display text-[30px] leading-tight sm:text-[42px]">{COSTS.heading}</h2>
        <p className="mt-3 text-center text-[16px] font-light text-ash sm:text-[18px]">{COSTS.sub}</p>

        <div className="mx-auto mt-9 grid max-w-[1150px] gap-10 sm:mt-[30px] md:grid-cols-3 md:gap-12 lg:gap-[50px]">
          {COSTS.items.map((item) => (
            <div key={item.label} className="border-t-2 border-ink pt-[26px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em]">{item.label}</p>
              <p className="mt-2 text-[38px] font-normal leading-tight">{item.value}</p>
              <div className="mt-2.5 text-[15px] font-light leading-[1.45] text-ash">
                {item.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
