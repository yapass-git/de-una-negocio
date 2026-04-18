"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { IoChevronForward } from "react-icons/io5";

import { cn } from "@/lib/cn";

export type SelectableRowProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  label: string;
  /** Leading element (icon, avatar, etc). */
  leading?: ReactNode;
  /** Hide the trailing chevron (true by default). */
  showChevron?: boolean;
};

/**
 * Molecule — horizontal row with a leading slot, a label and a trailing
 * chevron, used for inline navigation actions inside a screen
 * (e.g. "Agregar motivo (opcional) >").
 */
export function SelectableRow({
  label,
  leading,
  showChevron = true,
  className,
  type = "button",
  ...rest
}: SelectableRowProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex w-full items-center justify-between gap-2 px-1 py-2 text-left",
        "transition-opacity active:opacity-70 cursor-pointer",
        className,
      )}
      {...rest}
    >
      <span className="flex items-center gap-2 text-[13px] font-medium text-text-secondary">
        {leading}
        {label}
      </span>
      {showChevron ? (
        <IoChevronForward className="h-[18px] w-[18px] text-text-muted" />
      ) : null}
    </button>
  );
}
