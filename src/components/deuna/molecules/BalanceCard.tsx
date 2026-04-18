"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IoChevronForward,
  IoEyeOffOutline,
  IoEyeOutline,
} from "react-icons/io5";

import { cn } from "@/lib/cn";
import { AmountText } from "../atoms/AmountText";
import { Card } from "./Card";

export type BalanceCardProps = {
  /** Main balance amount in cents-less float (1000.5 → "$1.000,50"). */
  balance: number;
  /** Pending-to-receive amount, rendered below in green. */
  pending?: number;
  /** Currency prefix. Defaults to "$". */
  currency?: string;
  /** Label shown above the balance ("Mi Saldo"). */
  label?: string;
  /** Label for the pending line ("Por recibir"). */
  pendingLabel?: string;
  /** Controls initial visibility. */
  defaultVisible?: boolean;
  /** When provided, the card becomes tappable and renders a trailing
   *  chevron. Use `href` for navigation; `onPress` for ad-hoc handlers. */
  href?: string;
  onPress?: () => void;
  className?: string;
};

/** Formats 1000.5 → "1.000,50" (es-EC). Kept local because this is the
 *  only spot that needs LATAM number formatting so far. */
function formatLatam(value: number): string {
  const fixed = value.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withThousands},${decPart}`;
}

/**
 * Molecule — "Mi Saldo" balance tile with an eye-toggle that masks the
 * amount when the shopkeeper hands the phone to a customer. The
 * `pending` figure is styled in green and sits right below.
 */
export function BalanceCard({
  balance,
  pending,
  currency = "$",
  label = "Mi Saldo",
  pendingLabel = "Por recibir",
  defaultVisible = true,
  href,
  onPress,
  className,
}: BalanceCardProps) {
  const [visible, setVisible] = useState(defaultVisible);
  const isInteractive = href != null || onPress != null;

  const body = (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[12px] font-semibold text-text-secondary">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <AmountText
            value={`${currency}${formatLatam(balance)}`}
            visible={visible}
            size="xl"
            className="text-primary"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setVisible((v) => !v);
            }}
            aria-label={visible ? "Ocultar saldo" : "Mostrar saldo"}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-alt"
          >
            {visible ? (
              <IoEyeOutline className="h-[18px] w-[18px]" />
            ) : (
              <IoEyeOffOutline className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
        {pending != null ? (
          <span className="text-[12px] font-medium text-text-secondary">
            {pendingLabel}{" "}
            <span className="font-bold text-accent-green">
              {currency}
              {formatLatam(pending)}
            </span>
          </span>
        ) : null}
      </div>
      {isInteractive ? (
        <IoChevronForward className="h-[22px] w-[22px] shrink-0 text-text-muted" />
      ) : null}
    </>
  );

  const cardClasses = cn(
    "flex items-center gap-3",
    isInteractive && "cursor-pointer active:opacity-85",
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className="block">
        <Card variant="elevated" padding="lg" className={cardClasses}>
          {body}
        </Card>
      </Link>
    );
  }
  if (onPress) {
    return (
      <Card
        variant="elevated"
        padding="lg"
        className={cardClasses}
        role="button"
        tabIndex={0}
        onClick={onPress}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPress();
          }
        }}
      >
        {body}
      </Card>
    );
  }
  return (
    <Card variant="elevated" padding="lg" className={cardClasses}>
      {body}
    </Card>
  );
}
