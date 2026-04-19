"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type PercentOptionProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Text shown as the big face of the option — e.g. "5%" or "OTRO". */
  label: string;
  selected?: boolean;
};

/**
 * Atom — large tile used in the discount picker. Renders as a
 * rounded-rect with thin outline; the `selected` state switches the
 * border + label to the brand purple without adding a filled
 * background (matches the Deuna reference design).
 */
export function PercentOption({
  label,
  selected = false,
  className,
  type = "button",
  ...rest
}: PercentOptionProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "flex h-[88px] w-full select-none items-center justify-center rounded-[var(--radius-lg)]",
        "border-[1.5px] bg-white text-[32px] font-extrabold transition-colors",
        "cursor-pointer active:opacity-85 disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? "border-primary text-primary"
          : "border-line text-text-primary",
        className,
      )}
      {...rest}
    >
      {label}
    </button>
  );
}
