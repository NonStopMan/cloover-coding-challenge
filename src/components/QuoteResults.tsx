import Link from "next/link";
import { formatEur } from "@/lib/pricing";
import type { Offer } from "@/lib/pricing";

type QuoteResultsProps = {
  quote: {
    id: string;
    derived: {
      systemPrice: number;
      principal: number;
      riskBand: string;
      apr: number;
    };
    offers: Offer[];
  };
};

const bandColors: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-800",
  B: "bg-amber-100 text-amber-800",
  C: "bg-red-100 text-red-800",
};

export function QuoteResults({ quote }: QuoteResultsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Pre-qualification result</h2>
            <p className="text-zinc-600">System price: {formatEur(quote.derived.systemPrice)}</p>
            <p className="text-zinc-600">Principal: {formatEur(quote.derived.principal)}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${bandColors[quote.derived.riskBand] ?? "bg-zinc-100"}`}
          >
            Risk band {quote.derived.riskBand}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quote.offers.map((offer) => (
          <article
            key={offer.termYears}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-semibold">{offer.termYears}-year term</h3>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              {formatEur(offer.monthlyPayment)}
              <span className="text-sm font-normal text-zinc-500"> / month</span>
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              APR {(offer.apr * 100).toFixed(1)}%
            </p>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={`/api/quotes/${quote.id}/pdf`}
          className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Download PDF
        </a>
        <Link
          href="/quotes"
          className="rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
        >
          View all quotes
        </Link>
      </div>
    </div>
  );
}
