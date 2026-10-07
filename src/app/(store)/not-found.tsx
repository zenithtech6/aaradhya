import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <h1 className="font-heading text-3xl text-maroon">Diya not found</h1>
      <p className="text-sm text-muted-foreground">That product may have sold out.</p>
      <Link href="/" className="h-11 rounded-lg bg-maroon px-4 py-2 text-cream">
        Back to shop
      </Link>
    </div>
  );
}
