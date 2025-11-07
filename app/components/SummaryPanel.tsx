'use client';

import { useMemo } from "react";
import { formatCurrency } from "../lib/format";
import type { Expense } from "../lib/types";

interface SummaryPanelProps {
  expenses: Expense[];
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export function SummaryPanel({ expenses }: SummaryPanelProps) {
  const { total, thisWeek, streak } = useMemo(() => {
    if (!expenses.length) {
      return { total: 0, thisWeek: 0, streak: 0 };
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const totals = sum(expenses.map((expense) => expense.amount));
    const weekly = sum(
      expenses
        .filter((expense) => new Date(expense.date) >= startOfWeek)
        .map((expense) => expense.amount)
    );

    const uniqueDays = new Set(
      expenses.map((expense) => new Date(expense.date).toDateString())
    );

    let currentStreak = 0;
    let cursor = new Date(now);
    cursor.setHours(0, 0, 0, 0);

    while (uniqueDays.has(cursor.toDateString())) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return { total: totals, thisWeek: weekly, streak: currentStreak };
  }, [expenses]);

  const cards: Array<{ label: string; value: string; hint: string }> = [
    {
      label: "Total tracked",
      value: formatCurrency(total),
      hint: "Since the beginning"
    },
    {
      label: "This week",
      value: formatCurrency(thisWeek),
      hint: "Starting Monday"
    },
    {
      label: "Active streak",
      value: `${streak} day${streak === 1 ? "" : "s"}`,
      hint: "Consecutive tracked days"
    }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-card backdrop-blur-sm"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/50">
            {card.label}
          </span>
          <span className="text-2xl font-semibold text-ink md:text-3xl">
            {card.value}
          </span>
          <span className="text-xs text-black/40">{card.hint}</span>
        </article>
      ))}
    </section>
  );
}
