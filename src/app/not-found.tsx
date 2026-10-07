import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <h1 className="font-heading text-3xl text-maroon">Page not found</h1>
      <p className="text-sm text-muted-foreground">That page is not in this shop.</p>
      <Link href="/" className="inline-flex h-11 items-center rounded-lg bg-maroon px-4 text-cream">
        Back to shop
      </Link>
    </div>
  );
}
