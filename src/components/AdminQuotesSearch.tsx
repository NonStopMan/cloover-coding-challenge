"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminQuotesSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    router.push(`/admin/quotes?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="search" className="sr-only">
        Search by name or email
      </label>
      <input
        id="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name or email"
        className="w-full max-w-md rounded-md border border-zinc-300 px-3 py-2"
      />
      <button
        type="submit"
        className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
      >
        Filter
      </button>
    </form>
  );
}
