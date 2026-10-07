import Link from "next/link";
import { Suspense } from "react";
import { OrdersTodayCount } from "@/components/admin/OrdersTodayCount";
import { getDashboardCounts, getOrders } from "@/lib/queries";

export default function AdminHomePage() {
  return (
    <Suspense fallback={<p>Loading dashboard…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const [counts, orders] = await Promise.all([getDashboardCounts(), getOrders()]);
  const cards = [
    { label: "Products", value: counts.products, href: "/admin/products" },
    {
      label: "Orders today",
      value: <OrdersTodayCount createdAt={orders.map((order) => order.created_at)} />,
      href: "/admin/orders",
    },
    { label: "Total orders", value: counts.orders, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl text-maroon">Dashboard</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="gold-border rounded-2xl bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="font-heading mt-1 text-3xl text-maroon">{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link className="inline-flex h-11 items-center rounded-lg bg-[#4A0E1C] px-4 py-2 text-[#FFF6E5]" href="/admin/products">
          Manage products
        </Link>
        <Link className="inline-flex h-11 items-center rounded-lg border border-gold px-4 py-2 text-[#4A0E1C]" href="/admin/orders">
          View orders
        </Link>
        <Link className="inline-flex h-11 items-center rounded-lg border border-gold px-4 py-2 text-[#4A0E1C]" href="/admin/bills">
          Create a bill
        </Link>
      </div>
    </div>
  );
}
