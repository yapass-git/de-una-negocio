"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type SegmentedOptionVariant = "underline" | "pill";

export type SegmentedOptionProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  label: string;
  active: boolean;
  variant?: SegmentedOptionVariant;
};

const variantMap: Record<
  SegmentedOptionVariant,
  { base: string; active: string; inactive: string }
> = {
  underline: {
    base: "flex-1 pb-3 pt-2 text-[15px] font-bold transition-colors",
    active: "text-primary border-b-[3px] border-primary",
    inactive: "text-text-muted border-b-[3px] border-transparent",
  },
  pill: {
    base: "flex-1 rounded-full py-2 text-sm font-bold transition-colors",
    active: "bg-primary text-white",
    inactive: "bg-transparent text-primary",
  },
};

/**
 * Atom — one option inside a `SegmentedTabs` group. Two cosmetic
 * variants share the same API:
 *   - `underline`: bar-style tab header (e.g. Cobrar / Gestionar)
 *   - `pill`: inline toggle (e.g. QR / Manual)
 */
export function SegmentedOption({
  label,
  active,
  variant = "underline",
  className,
  type = "button",
  ...rest
}: SegmentedOptionProps) {
  const v = variantMap[variant];
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "cursor-pointer select-none",
        v.base,
        active ? v.active : v.inactive,
        className,
      )}
      {...rest}
    >
      {label}
    </button>
  );
}
