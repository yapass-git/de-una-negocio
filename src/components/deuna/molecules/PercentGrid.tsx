"use client";

import type { MouseEvent } from "react";

import { PercentOption } from "../atoms/PercentOption";

export type PercentChoice = number | "other";

export type PercentGridProps = {
  /** Discount percentages rendered in-order before the "OTRO" cell. */
  options?: readonly number[];
  value: PercentChoice | null;
  /** Called with the new choice and, when available, the underlying
   *  click event so callers can pin effects (confetti, ripples…) to
   *  the tapped cell. */
  onChange: (
    choice: PercentChoice,
    event?: MouseEvent<HTMLButtonElement>,
  ) => void;
  /** Label of the fallback cell. Defaults to "OTRO". */
  otherLabel?: string;
};

/**
 * Molecule — 2×2 grid of `PercentOption` atoms used as a single-select
 * discount picker ("5% · 10% · 15% · OTRO"). Leaves the specific
 * percentages configurable so the same component can power other
 * promo types.
 */
export function PercentGrid({
  options = [5, 10, 15],
  value,
  onChange,
  otherLabel = "OTRO",
}: PercentGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((pct) => (
        <PercentOption
          key={pct}
          label={`${pct}%`}
          selected={value === pct}
          onClick={(e) => onChange(pct, e)}
        />
      ))}
      <PercentOption
        label={otherLabel}
        selected={value === "other"}
        onClick={(e) => onChange("other", e)}
      />
    </div>
  );
}
