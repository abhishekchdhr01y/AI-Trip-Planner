import { dark } from "@clerk/themes";
import { PricingTable } from "@clerk/nextjs";

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 px-4 py-12 sm:py-20 w-full overflow-hidden">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Simple <span className="text-amber-500">pricing</span>
        </h2>
        <p className="mt-2 sm:mt-3 mb-8 sm:mb-10 text-base sm:text-lg text-gray-400">
          Start free. Upgrade when you travel more.
        </p>

        <div className="w-full overflow-x-auto">
          <PricingTable
            appearance={{
              baseTheme: dark,
              elements: {
                card: "bg-zinc-900 border border-zinc-800 text-white shadow-xl max-w-full",
                cardHeader: "bg-zinc-900 text-white",
                cardBody: "bg-zinc-900 text-white",
                cardFooter: "bg-zinc-900 text-white",
                pricingTableCard: "bg-zinc-900 border border-zinc-800 text-white",
              },
            } as any}
          />
        </div>
      </div>
    </section>
  );
}