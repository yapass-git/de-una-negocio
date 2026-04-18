"use client";

import { useState } from "react";

import { Button } from "../atoms/Button";
import { AmountDisplay } from "../molecules/AmountDisplay";
import { NumericKeypad } from "../molecules/NumericKeypad";
import { SegmentedTabs } from "../molecules/SegmentedTabs";
import { SelectableRow } from "../molecules/SelectableRow";

type PaymentMethod = "qr" | "manual";

export type CobrarPanelProps = {
  /** Initial amount in base-unit string (e.g. `"0"`, `"20"`, `"12,50"`). */
  initialAmount?: string;
  /** Decimal separator used by the keypad. Defaults to `","`. */
  decimal?: string;
  onMotivoPress?: () => void;
  onContinue?: (payload: { amount: string; method: PaymentMethod }) => void;
};

const METHOD_OPTIONS = [
  { id: "qr" as const, label: "QR" },
  { id: "manual" as const, label: "Manual" },
];

/** Stops a "0" prefix from sneaking onto later digits, keeps at most
 *  one decimal separator and caps the total length so the display
 *  doesn't overflow the screen. */
function pushDigit(current: string, digit: string, decimal: string): string {
  if (digit === decimal) {
    return current.includes(decimal) ? current : `${current}${decimal}`;
  }
  if (current === "0") return digit;
  // Soft cap: 10 chars fits "9.999.999,99" comfortably on mobile.
  if (current.length >= 10) return current;
  return `${current}${digit}`;
}

function popDigit(current: string): string {
  if (current.length <= 1) return "0";
  return current.slice(0, -1);
}

/**
 * Organism — Cobrar panel: amount display + payment method toggle +
 * "Agregar motivo" row + numeric keypad + main CTA. Fully self-contained
 * state-wise, so the hosting screen only needs to read the final amount
 * via the `onContinue` callback when the user taps the CTA.
 */
export function CobrarPanel({
  initialAmount = "0",
  decimal = ",",
  onMotivoPress,
  onContinue,
}: CobrarPanelProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [method, setMethod] = useState<PaymentMethod>("qr");

  const disabled = amount === "0" || amount === "";

  return (
    <div className="flex flex-col gap-3 px-4 pt-2">
      <AmountDisplay label="Monto" value={amount} />

      <SegmentedTabs
        items={METHOD_OPTIONS}
        value={method}
        onChange={setMethod}
        variant="pill"
        ariaLabel="Método de cobro"
        className="mx-auto max-w-[320px]"
      />

      <SelectableRow
        label="Agregar motivo (opcional)"
        onClick={onMotivoPress}
        className="mx-auto w-full max-w-[320px]"
      />

      <NumericKeypad
        className="mx-auto w-full max-w-[320px] pt-2"
        decimal={decimal}
        onDigit={(d) => setAmount((a) => pushDigit(a, d, decimal))}
        onBackspace={() => setAmount(popDigit)}
      />

      <div className="mx-auto w-full max-w-[320px] pt-2">
        <Button
          label="Continuar para Cobrar"
          size="lg"
          disabled={disabled}
          onClick={() => onContinue?.({ amount, method })}
        />
      </div>
    </div>
  );
}
