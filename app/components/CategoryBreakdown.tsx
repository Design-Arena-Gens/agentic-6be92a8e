'use client';

import { useMemo } from "react";
import { CATEGORIES } from "../lib/categories";
import { formatCurrency } from "../lib/format";
import type { Expense } from "../lib/types";

interface CategoryBreakdownProps {
  expenses: Expense[];
}

export function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
  const categoryTotals = useMemo(() => {
    const base = new Map<string, number>();
    CATEGORIES.forEach((category) => base.set(category, 0));
    expenses.forEach((expense) => {
      base.set(expense.category, (base.get(expense.category) ?? 0) + expense.amount);
    });
    return base;
  }, [expenses]);

  const total = [...categoryTotals.values()].reduce(
    (sum, value) => sum + value,
    0
  );

  if (!total) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white/20 p-8 text-center text-sm text-black/60">
        Spend in a few categories to surface the minimal chart.
      </div>
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border border-black/5 bg-white/70 p-6 shadow-card backdrop-blur-sm">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-black/50">
            Category breakdown
          </h2>
          <p className="text-xs text-black/40">
            Showing share of total tracked spending
          </p>
        </div>
        <span className="rounded-full bg-black/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
          {formatCurrency(total)}
        </span>
      </header>

      <div className="space-y-3">
        {[...categoryTotals.entries()]
          .filter(([, value]) => value > 0)
          .sort(([, a], [, b]) => b - a)
          .map(([category, value]) => {
            const ratio = value / total;
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-black/50">
                  <span>{category}</span>
                  <span>{Math.round(ratio * 100)}%</span>
                </div>
                <div className="relative h-2 rounded-full bg-black/10">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all"
                    style={{ width: `${ratio * 100}%` }}
                    aria-hidden
                  />
                </div>
                <div className="text-xs text-black/40">
                  {formatCurrency(value)}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
