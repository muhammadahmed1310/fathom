import { SearchScreen } from "@/components/SearchScreen";
import { Suspense } from "react";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="px-6 py-8 text-sm text-muted">Searching notes…</p>}>
      <SearchScreen />
    </Suspense>
  );
}
