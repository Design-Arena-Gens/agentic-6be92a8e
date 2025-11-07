'use client';

import { CATEGORIES } from "../lib/categories";

export type RangeFilter = "30" | "90" | "365" | "all";

interface FilterBarProps {
  category: string;
  onCategoryChange(value: string): void;
  range: RangeFilter;
  onRangeChange(value: RangeFilter): void;
}

const RANGES: Array<{ label: string; value: RangeFilter }> = [
  { label: "30d", value: "30" },
  { label: "90d", value: "90" },
  { label: "1y", value: "365" },
  { label: "All", value: "all" }
];

export function FilterBar({
  category,
  onCategoryChange,
  range,
  onRangeChange
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/70 p-4 shadow-card backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-black/40">
          Category
        </span>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs uppercase tracking-wide text-black/60 transition hover:border-black/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="all">All</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-black/40">
          Range
        </span>
        <div className="flex gap-1 rounded-full bg-black/5 p-1">
          {RANGES.map((option) => (
            <button
              key={option.value}
              onClick={() => onRangeChange(option.value)}
              className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide transition ${
                range === option.value
                  ? "bg-ink text-white"
                  : "text-black/60 hover:bg-black/10"
              }`}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
