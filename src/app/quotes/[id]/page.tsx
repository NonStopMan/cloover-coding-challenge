import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { QuoteResults } from "@/components/QuoteResults";
import { serializeQuote } from "@/lib/api-utils";
import type { Offer } from "@/lib/pricing";

type PageProps = { params: Promise<{ id: string }> };

export default async function QuoteDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) return null;

  const { id } = await params;
  const quote = await db.quote.findUnique({ where: { id } });

  if (!quote) notFound();
  if (quote.userId !== session.user.id && session.user.role !== "ADMIN") {
    notFound();
  }

  const serialized = serializeQuote(quote);

  return (
    <QuoteResults
      quote={{
        id: serialized.id,
        derived: serialized.derived,
        offers: serialized.offers as Offer[],
      }}
    />
  );
}
