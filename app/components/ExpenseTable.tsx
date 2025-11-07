'use client';

import { useMemo } from "react";
import clsx from "clsx";
import { formatDate, formatCurrency } from "../lib/format";
import type { Expense } from "../lib/types";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete(id: string): void;
}

export function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  const sorted = useMemo(
    () =>
      [...expenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [expenses]
  );

  if (!sorted.length) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-black/10 bg-white/20 p-12 text-center text-sm text-black/60">
        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl">🪙</span>
          <p>
            Track your first expense to unlock insights. Minimal clutter, just
            momentum.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-card">
      <table className="min-w-full divide-y divide-black/5">
        <thead className="bg-black/5 text-left text-xs uppercase tracking-widest text-black/60">
          <tr>
            <th className="px-4 py-3">Label</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right"> </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 text-sm">
          {sorted.map((expense) => (
            <tr key={expense.id} className="transition hover:bg-black/5">
              <td className="px-4 py-3">
                <div className="font-medium">{expense.label}</div>
                {expense.notes ? (
                  <div className="text-xs text-black/50">{expense.notes}</div>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
                    "bg-accent/10 text-accent"
                  )}
                >
                  {expense.category}
                </span>
              </td>
              <td className="px-4 py-3 text-black/60">
                {formatDate(expense.date)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-ink">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(expense.id)}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-wide text-black/50 transition hover:border-red-400 hover:text-red-500"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
