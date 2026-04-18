"use client";

import { SuccessCheck } from "../atoms/SuccessCheck";
import { BarChart, type BarChartDatum } from "../molecules/BarChart";
import { Card } from "../molecules/Card";
import { ReachCard } from "../molecules/ReachCard";
import { Modal } from "./Modal";

/** Default synthetic sales — the "consequence" projection shown under
 *  the success affordance. Replaced by real data when the app is
 *  wired to a stats endpoint. */
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
  /** Nearby clients that received the campaign in real-time. */
  delivered?: number;
  /** Percent the owner applied — rendered in the success subtitle. */
  percent?: number | null;
  /** Brand label shown in the success subtitle ("Netlife"). */
  brand?: string;
  /** Headline inside the projections card. */
  weekLabel?: string;
  data?: readonly BarChartDatum[];
};

/**
 * Organism — post-promo summary modal. Leads with a bold success
 * affordance (green check + "Promo lanzada"), then surfaces the real
 * reach count from the API and, below, a projected week of sales as
 * the natural consequence of the discount the owner just applied.
 */
export function SalesStatsModal({
  open,
  onClose,
  delivered = 0,
  percent,
  brand = "Netlife",
  weekLabel = "Ventas Semana del 13 al 19 de abril",
  data = DEFAULT_DATA,
}: SalesStatsModalProps) {
  const percentLabel =
    percent != null && Number.isFinite(percent) ? `${percent}%` : null;

  return (
    <Modal open={open} onClose={onClose} title="Estadísticas">
      <div className="flex flex-col gap-4 px-4 py-4">
        <Card
          variant="elevated"
          padding="lg"
          className="flex items-center gap-3 border border-accent-green/20 bg-accent-green-soft"
        >
          <SuccessCheck size="md" />
          <div className="flex flex-col gap-0.5">
            <span className="text-title-sm text-[#1b7a3f]">
              ¡Promo lanzada!
            </span>
            <span className="text-[12px] font-semibold text-[#1b7a3f]/80">
              {percentLabel
                ? `Aplicaste ${percentLabel} con ${brand}`
                : `Promo activa con ${brand}`}
            </span>
          </div>
        </Card>

        <ReachCard delivered={delivered} />

        <Card variant="elevated" padding="lg" className="flex flex-col gap-4">
          <h3 className="text-title-sm text-primary">{weekLabel}</h3>
          <BarChart data={data} height={240} />
        </Card>
      </div>
    </Modal>
  );
}
