"use client";

import { useEffect, useState } from "react";

function partsUntil(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

function Cell({ label, value }: { label: string; value: number }) {
  return (
    <div className="gold-border min-w-16 rounded-xl bg-card px-3 py-2">
      <p className="font-heading text-2xl text-maroon">{String(value).padStart(2, "0")}</p>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

export function Countdown({ date }: { date: string | null | undefined }) {
  const [time, setTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    done: boolean;
  } | null>(null);

  useEffect(() => {
    if (!date) return;
    const target = new Date(date);
    if (Number.isNaN(target.getTime())) return;
    const tick = () => setTime(partsUntil(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [date]);

  if (!date || !time) return null;

  return (
    <section className="px-4 py-10 text-center">
      <h2 className="font-heading text-2xl text-maroon">Diwali countdown</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {time.done ? "Happy Diwali" : "Light your home before the festival"}
      </p>
      {time.done ? null : (
        <div className="mt-4 flex justify-center gap-2">
          <Cell label="Days" value={time.days} />
          <Cell label="Hours" value={time.hours} />
          <Cell label="Mins" value={time.minutes} />
          <Cell label="Secs" value={time.seconds} />
        </div>
      )}
    </section>
  );
}
