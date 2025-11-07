'use client';

import { useMemo } from "react";
import { formatCurrency } from "../lib/format";
import type { Expense } from "../lib/types";

interface MicroStatsProps {
  expenses: Expense[];
}

export function MicroStats({ expenses }: MicroStatsProps) {
  const stats = useMemo(() => {
    if (!expenses.length) {
      return {
        average: 0,
        largest: null as Expense | null,
        smallest: null as Expense | null
      };
    }

    const sorted = [...expenses].sort((a, b) => a.amount - b.amount);
    const average =
      sorted.reduce((total, expense) => total + expense.amount, 0) /
      sorted.length;

    return {
      average,
      largest: sorted.at(-1) ?? null,
      smallest: sorted[0] ?? null
    };
  }, [expenses]);

  return (
    <section className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-card backdrop-blur-sm">
      <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
        Micro stats
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-black/40">
            Average ticket
          </div>
          <div className="text-lg font-semibold text-ink">
            {formatCurrency(stats.average || 0)}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-black/40">
            Largest expense
          </div>
          {stats.largest ? (
            <div className="space-y-1">
              <div className="text-lg font-semibold text-ink">
                {formatCurrency(stats.largest.amount)}
              </div>
              <div className="text-xs text-black/40">
                {stats.largest.label}
              </div>
            </div>
          ) : (
            <div className="text-sm text-black/40">–</div>
          )}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-black/40">
            Lightest expense
          </div>
          {stats.smallest ? (
            <div className="space-y-1">
              <div className="text-lg font-semibold text-ink">
                {formatCurrency(stats.smallest.amount)}
              </div>
              <div className="text-xs text-black/40">
                {stats.smallest.label}
              </div>
            </div>
          ) : (
            <div className="text-sm text-black/40">–</div>
          )}
        </div>
      </div>
    </section>
  );
}
