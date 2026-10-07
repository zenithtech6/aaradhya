"use client";

import { Button } from "@/components/ui/button";

export function ErrorFallback({
  reset,
  title = "Something went wrong",
}: {
  error?: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <h1 className="font-heading text-3xl text-maroon">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Please try again. If this keeps happening, order on WhatsApp from the home page.
      </p>
      <Button className="h-11 bg-maroon text-cream" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
