"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type NumericKeyProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Digit or character rendered as the key face. Ignored if `icon` is set. */
  value?: string;
  /** Custom node (e.g. a backspace icon) that replaces `value`. */
  icon?: ReactNode;
};

/**
 * Atom — single tile on the numeric keypad. Intentionally thin (no
 * borders, no background): the parent grid supplies rhythm and the
 * active-opacity feedback is the only built-in affordance so the key
 * blends with any amount-entry screen.
 */
export function NumericKey({
  value,
  icon,
  className,
  type = "button",
  ...rest
}: NumericKeyProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex h-14 select-none items-center justify-center rounded-lg text-[26px] font-bold text-primary",
        "transition-opacity active:opacity-60 disabled:opacity-40",
        "cursor-pointer",
        className,
      )}
      {...rest}
    >
      {icon ?? value}
    </button>
  );
}
