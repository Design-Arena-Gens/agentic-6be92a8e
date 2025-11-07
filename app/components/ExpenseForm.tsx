'use client';

import { useState } from "react";
import { z } from "zod";
import { CATEGORIES } from "../lib/categories";
import type { Expense } from "../lib/types";

const expenseSchema = z.object({
  label: z.string().min(2, "Label is required"),
  amount: z.preprocess(
    (value) => Number(value),
    z
      .number({ invalid_type_error: "Enter a number" })
      .positive("Greater than 0")
      .max(1_000_000, "That looks too large")
  ),
  category: z.enum(CATEGORIES),
  date: z.string(),
  notes: z.string().optional()
});

type ExpenseDraft = {
  label: string;
  amount: string;
  category: (typeof CATEGORIES)[number];
  date: string;
  notes: string;
};

const emptyDraft = (): ExpenseDraft => ({
  label: "",
  amount: "",
  category: CATEGORIES[0],
  date: new Date().toISOString().slice(0, 10),
  notes: ""
});

interface ExpenseFormProps {
  onCreate(expense: Expense): void;
}

export function ExpenseForm({ onCreate }: ExpenseFormProps) {
  const [draft, setDraft] = useState<ExpenseDraft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);

  const setDraftField =
    <K extends keyof ExpenseDraft>(field: K) =>
    (value: ExpenseDraft[K]) =>
      setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = expenseSchema.safeParse(draft);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      ...result.data,
      amount: Number(result.data.amount),
      date: new Date(result.data.date).toISOString(),
      notes: result.data.notes?.trim() || undefined
    };

    onCreate(expense);
    setDraft(emptyDraft());
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-black/5 bg-white/60 p-4 shadow-card backdrop-blur-sm transition hover:border-black/10 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-widest text-black/60">
          Label
        </label>
        <input
          value={draft.label}
          onChange={(event) => setDraftField("label")(event.target.value)}
          placeholder="Coffee with friend"
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-widest text-black/60">
          Amount
        </label>
        <input
          value={draft.amount ? draft.amount : ""}
          onChange={(event) => setDraftField("amount")(event.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="12.75"
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-widest text-black/60">
          Date
        </label>
        <input
          value={draft.date}
          onChange={(event) => setDraftField("date")(event.target.value)}
          type="date"
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-widest text-black/60">
          Category
        </label>
        <select
          value={draft.category}
          onChange={(event) =>
            setDraftField("category")(event.target.value as ExpenseDraft["category"])
          }
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        >
          {CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="text-xs uppercase tracking-widest text-black/60">
          Notes
        </label>
        <textarea
          value={draft.notes}
          onChange={(event) => setDraftField("notes")(event.target.value)}
          placeholder="Optional context..."
          rows={2}
          className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="flex items-center justify-between sm:col-span-2">
        {error ? (
          <span className="text-xs font-medium text-red-500">{error}</span>
        ) : (
          <span className="text-xs uppercase tracking-widest text-black/40">
            Minimal inputs. Maximum clarity.
          </span>
        )}
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wide text-canvas transition hover:bg-black"
        >
          Add expense
        </button>
      </div>
    </form>
  );
}
