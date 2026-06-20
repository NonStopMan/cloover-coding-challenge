import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatEur } from "@/lib/pricing";

export default async function QuotesPage() {
  const session = await auth();
  if (!session?.user) return null;

  const quotes = await db.quote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My quotes</h1>
        <p className="mt-2 text-zinc-600">Your pre-qualification history.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">System size</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Band</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  No quotes yet.{" "}
                  <Link href="/" className="text-emerald-700 hover:underline">
                    Create your first quote
                  </Link>
                </td>
              </tr>
            ) : (
              quotes.map((quote: any) => (
                <tr key={quote.id} className="border-b border-zinc-100">
                  <td className="px-4 py-3">
                    {quote.createdAt.toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-4 py-3">{quote.systemSizeKw} kW</td>
                  <td className="px-4 py-3">{formatEur(quote.systemPrice)}</td>
                  <td className="px-4 py-3">{quote.riskBand}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/quotes/${quote.id}`}
                      className="text-emerald-700 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
