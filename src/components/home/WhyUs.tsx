import { Clock3, HandHeart, Wallet } from "lucide-react";

const points = [
  {
    icon: Clock3,
    title: "24-hour delivery",
    text: "Order today, light up tomorrow.",
  },
  {
    icon: Wallet,
    title: "Cash on delivery",
    text: "Pay when your diyas arrive.",
  },
  {
    icon: HandHeart,
    title: "Handmade",
    text: "Crafted for a warm, festive glow.",
  },
];

export function WhyUs() {
  return (
    <section className="px-4 py-10">
      <div className="rangoli-divider mb-8" />
      <h2 className="font-heading text-center text-2xl text-maroon">Why order with us</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {points.map((point) => (
          <div key={point.title} className="gold-border rounded-2xl bg-card p-4 text-center">
            <point.icon className="mx-auto size-8 text-gold" />
            <h3 className="mt-2 font-heading text-lg text-maroon">{point.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{point.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
