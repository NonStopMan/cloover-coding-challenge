import { auth } from "@/lib/auth";
import { QuoteForm } from "@/components/QuoteForm";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Solar pre-qualification</h1>
        <p className="mt-2 text-zinc-600">
          Request a quote for your residential solar system and view installment
          offers in EUR.
        </p>
      </div>
      <QuoteForm
        defaultFullName={session?.user.fullName ?? ""}
        defaultEmail={session?.user.email ?? ""}
      />
    </div>
  );
}
