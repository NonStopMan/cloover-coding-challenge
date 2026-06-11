import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatEur } from "@/lib/pricing";
import { AdminQuotesSearch } from "@/components/AdminQuotesSearch";

type PageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function AdminQuotesPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) return null;

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { search } = await searchParams;

  const quotes = await db.quote.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin — All quotes</h1>
        <p className="mt-2 text-zinc-600">
          View and filter quotes across all users.
        </p>
      </div>

      <Suspense fallback={<div className="h-10" />}>
        <AdminQuotesSearch />
      </Suspense>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">System size</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Band</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id} className="border-b border-zinc-100">
                <td className="px-4 py-3">
                  {quote.createdAt.toLocaleDateString("de-DE")}
                </td>
                <td className="px-4 py-3">{quote.user.fullName}</td>
                <td className="px-4 py-3">{quote.user.email}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
