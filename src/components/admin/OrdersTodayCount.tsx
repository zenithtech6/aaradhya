"use client";

import { useEffect, useState } from "react";

export function OrdersTodayCount({ createdAt }: { createdAt: string[] }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const startMs = start.getTime();
    setCount(createdAt.filter((value) => Date.parse(value) >= startMs).length);
  }, [createdAt]);

  return <>{count ?? "—"}</>;
}
