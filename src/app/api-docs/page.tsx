import { ApiDocsClient } from "@/components/ApiDocsClient";

export default function ApiDocsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">API documentation</h1>
      <p className="text-zinc-600">
        OpenAPI specification for the GreenQuote REST API.
      </p>
      <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
        <ApiDocsClient />
      </div>
    </div>
  );
}
