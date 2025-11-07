'use client';

import { useMemo } from "react";
import { format } from "date-fns";
import type { Expense } from "../lib/types";

interface SpendingTimelineProps {
  expenses: Expense[];
  days?: number;
}

export function SpendingTimeline({
  expenses,
  days = 14
}: SpendingTimelineProps) {
  const points = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const series: Array<{ day: string; amount: number }> = [];
    for (let index = 0; index < days; index += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      const label = day.toISOString().slice(0, 10);
      series.push({ day: label, amount: 0 });
    }

    expenses.forEach((expense) => {
      const label = expense.date.slice(0, 10);
      const match = series.find((entry) => entry.day === label);
      if (match) {
        match.amount += expense.amount;
      }
    });

    const maxValue = Math.max(...series.map((point) => point.amount), 1);
    return { series, maxValue };
  }, [days, expenses]);

  return (
    <section className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-card backdrop-blur-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-black/50">
            Pulse
          </h2>
          <p className="text-xs text-black/40">
            Recent daily spending, last {days} days
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_min-content]">
        <div className="flex h-32 items-end gap-1">
          {points.series.map((point) => (
            <div key={point.day} className="flex h-full flex-1 flex-col justify-end">
              <div
                className="rounded-t-full bg-ink transition-all"
                style={{
                  height: `${(point.amount / points.maxValue) * 100}%`,
                  minHeight: point.amount ? "4px" : "2px",
                  opacity: point.amount ? 0.85 : 0.2
                }}
                aria-hidden
              />
            </div>
          ))}
        </div>
        <div className="hidden flex-col justify-between md:flex">
          <span className="text-xs uppercase tracking-widest text-black/40">
            Max
          </span>
          <span className="text-xs uppercase tracking-widest text-black/40">
            Min
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-widest text-black/30">
        {points.series.map((point, index) => (
          <span key={point.day} className="truncate">
            {index % 2 === 0 ? format(new Date(point.day), "MMM d") : ""}
          </span>
        ))}
      </div>
    </section>
  );
}
