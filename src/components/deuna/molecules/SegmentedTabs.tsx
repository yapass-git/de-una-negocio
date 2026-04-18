"use client";

import { cn } from "@/lib/cn";
import {
  SegmentedOption,
  type SegmentedOptionVariant,
} from "../atoms/SegmentedOption";

export type SegmentedTabItem<T extends string = string> = {
  id: T;
  label: string;
};

export type SegmentedTabsProps<T extends string = string> = {
  items: readonly SegmentedTabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  variant?: SegmentedOptionVariant;
  className?: string;
  ariaLabel?: string;
};

/**
 * Molecule — a horizontal group of `SegmentedOption` atoms wired to a
 * single controlled value. Powers both the top Cobrar/Gestionar switcher
 * (`underline` variant) and the inline QR/Manual toggle (`pill`).
 *
 * The generic `T` preserves the literal union of `items[number]["id"]`
 * across `value` and `onChange`, so consumers get autocompletion and
 * exhaustive-switch friendliness.
 */
export function SegmentedTabs<T extends string = string>({
  items,
  value,
  onChange,
  variant = "underline",
  className,
  ariaLabel,
}: SegmentedTabsProps<T>) {
  const wrapperBase =
    variant === "underline"
      ? "flex w-full border-b border-line"
      : "flex w-full gap-1 rounded-full border border-primary/20 bg-primary-soft p-1";

  return (
    <div role="tablist" aria-label={ariaLabel} className={cn(wrapperBase, className)}>
      {items.map((it) => (
        <SegmentedOption
          key={it.id}
          label={it.label}
          variant={variant}
          active={it.id === value}
          role="tab"
          aria-selected={it.id === value}
          onClick={() => onChange(it.id)}
        />
      ))}
    </div>
  );
}
