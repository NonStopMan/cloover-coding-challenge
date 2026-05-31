import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-emerald-700">
          GreenQuote
        </Link>
        <nav className="flex items-center gap-4 text-sm" aria-label="Main">
          {session?.user ? (
            <>
              <Link href="/" className="hover:text-emerald-700">
                New quote
              </Link>
              <Link href="/quotes" className="hover:text-emerald-700">
                My quotes
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin/quotes" className="hover:text-emerald-700">
                  Admin
                </Link>
              )}
              <Link href="/api-docs" className="hover:text-emerald-700">
                API docs
              </Link>
              <span className="text-zinc-500">{session.user.fullName}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-emerald-700">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
