"use client";

import { BarChart, type BarChartDatum } from "../molecules/BarChart";
import { Card } from "../molecules/Card";
import { Modal } from "./Modal";

/** Default synthetic data — the week the MVP is shipping. Swap with a
 *  real endpoint once analytics are wired up. */
const DEFAULT_DATA: readonly BarChartDatum[] = [
  { label: "Lun", value: 58 },
  { label: "Mar", value: 40 },
  { label: "Mié", value: 52 },
  { label: "Jue", value: 70 },
  { label: "Vie", value: 86 },
  { label: "Sáb", value: 94 },
  { label: "Dom", value: 60 },
];

export type SalesStatsModalProps = {
  open: boolean;
  onClose: () => void;
  /** Headline shown above the chart. */
  weekLabel?: string;
  /** Bar series. Falls back to a canned week-view for the demo. */
  data?: readonly BarChartDatum[];
};

/**
 * Organism — read-only stats view. Independent from the promo launch
 * flow: opening it just renders the weekly sales card. When analytics
 * grow (totals, top products, comparisons…) this modal is where they
 * land.
 */
export function SalesStatsModal({
  open,
  onClose,
  weekLabel = "Ventas Semana del 13 al 19 de abril",
  data = DEFAULT_DATA,
}: SalesStatsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Estadísticas">
      <div className="flex flex-col gap-4 px-4 py-4">
        <Card variant="elevated" padding="lg" className="flex flex-col gap-4">
          <h3 className="text-title-sm text-primary">{weekLabel}</h3>
          <BarChart data={data} height={240} />
        </Card>
      </div>
    </Modal>
  );
}
