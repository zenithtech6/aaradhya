"use client";

import { ErrorFallback } from "@/components/ui/error-fallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-full bg-[#FFF6E5] font-sans">
        <ErrorFallback error={error} reset={reset} title="The shop could not load" />
      </body>
    </html>
  );
}
