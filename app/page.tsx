'use client';

import { useEffect, useMemo, useState } from "react";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseTable } from "./components/ExpenseTable";
import { SummaryPanel } from "./components/SummaryPanel";
import { CategoryBreakdown } from "./components/CategoryBreakdown";
import { SpendingTimeline } from "./components/SpendingTimeline";
import { FilterBar, RangeFilter } from "./components/FilterBar";
import { MicroStats } from "./components/MicroStats";
import { usePersistentState } from "./lib/use-persistent-state";
import { seededExpenses } from "./lib/seed";
import type { Expense } from "./lib/types";

const STORAGE_KEY = "ledger-expenses";

export default function Page() {
  const [expenses, setExpenses, hydrated] = usePersistentState<Expense[]>(
    STORAGE_KEY,
    []
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>("90");

  useEffect(() => {
    if (!hydrated) return;
    if (expenses.length === 0) {
      setExpenses(seededExpenses);
    }
  }, [expenses.length, hydrated, setExpenses]);

  const filteredExpenses = useMemo(() => {
    if (!expenses.length) return [];

    let result = expenses;
    if (categoryFilter !== "all") {
      result = result.filter((expense) => expense.category === categoryFilter);
    }
    if (rangeFilter !== "all") {
      const days = Number(rangeFilter);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter((expense) => new Date(expense.date) >= cutoff);
    }
    return result;
  }, [categoryFilter, expenses, rangeFilter]);

  const handleCreate = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-5 py-12">
      <header className="space-y-4">
        <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-black/40">
          Ledger
        </span>
        <h1 className="text-4xl font-semibold leading-tight text-ink md:text-5xl">
          Track your expenses with clarity and minimal noise.
        </h1>
        <p className="max-w-xl text-sm text-black/50">
          Ledger keeps your spending log clean and tactile. Add entries by hand,
          watch insights adapt instantly, and stay mindful without overwhelming
          dashboards.
        </p>
      </header>

      <section className="grid gap-6">
        <ExpenseForm onCreate={handleCreate} />
        <FilterBar
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          range={rangeFilter}
          onRangeChange={setRangeFilter}
        />
      </section>

      <SummaryPanel expenses={filteredExpenses} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <ExpenseTable expenses={filteredExpenses} onDelete={handleDelete} />
        <div className="grid gap-6">
          <MicroStats expenses={filteredExpenses} />
          <SpendingTimeline expenses={filteredExpenses} />
        </div>
      </section>

      <CategoryBreakdown expenses={filteredExpenses} />

      <footer className="pb-12 pt-6 text-center text-xs text-black/40">
        Built for mindful money tracking — your data stays local in your
        browser.
      </footer>
    </main>
  );
}
