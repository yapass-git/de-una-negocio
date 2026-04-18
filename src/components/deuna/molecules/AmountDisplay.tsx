import { cn } from "@/lib/cn";

export type AmountDisplayProps = {
  /** Headline above the amount (e.g. "Monto"). */
  label?: string;
  /** Already-formatted amount string (e.g. "20" or "1.250,50"). */
  value: string;
  /** Currency prefix rendered before the amount. Defaults to `"$"`. */
  currency?: string;
  className?: string;
};

/**
 * Molecule — the big centered amount block used at the top of the
 * "Cobrar" flow. Composition only — no state — so the keypad can drive
 * the value from the parent.
 */
export function AmountDisplay({
  label,
  value,
  currency = "$",
  className,
}: AmountDisplayProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-2",
        className,
      )}
    >
      {label ? (
        <span className="text-[13px] font-medium text-text-secondary">
          {label}
        </span>
      ) : null}
      <div className="flex items-baseline gap-2 text-primary">
        <span className="text-[44px] font-bold leading-[50px]">{currency}</span>
        <span className="text-[64px] font-extrabold leading-[70px] tracking-tight">
          {value}
        </span>
      </div>
    </div>
  );
}
