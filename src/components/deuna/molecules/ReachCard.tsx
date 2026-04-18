import { IoPeopleOutline } from "react-icons/io5";

import { cn } from "@/lib/cn";
import { Card } from "./Card";

export type ReachCardProps = {
  /** How many nearby users received the broadcast. */
  delivered: number;
  /** Headline above the counter. Defaults to "Alcance". */
  label?: string;
  /** Copy shown below the number when `delivered > 0`. */
  hint?: string;
  /** Copy shown below when `delivered === 0`. */
  zeroHint?: string;
  className?: string;
};

/**
 * Molecule — result card that surfaces the `delivered` counter from
 * the campaigns API right after a launch. When nobody was nearby with
 * the app open, switches to a reassuring fallback copy so the user
 * doesn't read the "0" as a failure.
 */
export function ReachCard({
  delivered,
  label = "Alcance",
  hint = "clientes cercanos recibieron tu promo en vivo.",
  zeroHint = "Nadie tenía la app abierta en este instante. Verán la promo en cuanto entren.",
  className,
}: ReachCardProps) {
  const isZero = delivered === 0;

  return (
    <Card
      variant="elevated"
      padding="lg"
      className={cn("flex items-center gap-3", className)}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <IoPeopleOutline className="h-[26px] w-[26px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[12px] font-semibold text-text-secondary">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-[32px] font-extrabold leading-9 text-primary">
            {delivered}
          </span>
          <span className="text-[13px] font-semibold text-text-secondary">
            {delivered === 1 ? "cliente" : "clientes"}
          </span>
        </div>
        <span className="text-[12px] font-medium leading-snug text-text-secondary">
          {isZero ? zeroHint : hint}
        </span>
      </div>
    </Card>
  );
}
