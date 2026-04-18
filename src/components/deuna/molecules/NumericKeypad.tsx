"use client";

import { IoBackspace } from "react-icons/io5";

import { cn } from "@/lib/cn";
import { NumericKey } from "../atoms/NumericKey";

export type NumericKeypadProps = {
  /** Called with a single character (`"0"`-`"9"` or the decimal separator). */
  onDigit: (digit: string) => void;
  /** Called when the backspace key is pressed. */
  onBackspace: () => void;
  /** Character rendered as the decimal separator. Defaults to `","`. */
  decimal?: string;
  className?: string;
};

/**
 * Molecule — 4×3 numeric keypad (1-9, decimal separator, 0, backspace).
 * All the layout rhythm lives here; individual keys are pure
 * `NumericKey` atoms, so the grid can be themed or resized globally.
 */
export function NumericKeypad({
  onDigit,
  onBackspace,
  decimal = ",",
  className,
}: NumericKeypadProps) {
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div
      role="group"
      aria-label="Teclado numérico"
      className={cn("grid grid-cols-3 gap-y-1 gap-x-2", className)}
    >
      {digits.map((d) => (
        <NumericKey key={d} value={d} onClick={() => onDigit(d)} />
      ))}
      <NumericKey value={decimal} onClick={() => onDigit(decimal)} />
      <NumericKey value="0" onClick={() => onDigit("0")} />
      <NumericKey
        aria-label="Borrar"
        onClick={onBackspace}
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <IoBackspace className="h-[22px] w-[22px]" />
          </span>
        }
      />
    </div>
  );
}
