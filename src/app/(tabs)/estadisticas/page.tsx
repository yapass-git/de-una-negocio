"use client";

import { useRouter } from "next/navigation";

import {
  BarChart,
  type BarChartDatum,
  BusinessHeader,
  Button,
  Card,
} from "@/components/deuna";

/**
 * Synthetic week-view used while analytics are not wired to the API.
 * Mirrors the seed values shown in the Figma frame.
 */
const WEEK: readonly BarChartDatum[] = [
  { label: "Lun", value: 30 },
  { label: "Mar", value: 47 },
  { label: "Mié", value: 28 },
  { label: "Jue", value: 42 },
  { label: "Vier", value: 50 },
  { label: "Sáb", value: 55 },
  { label: "Dom", value: 26 },
];

/**
 * Estadísticas — read-only weekly sales view.
 *
 * Replaces the standalone `SalesStatsModal` for the new bottom-tab
 * navigation: the same chart now lives at `/estadisticas` so it can be
 * reached either from the Beneficios tab (via the Desafíos hub) or
 * from the "Estadísticas" novedad on Gestionar.
 */
export default function EstadisticasScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col pt-[max(env(safe-area-inset-top),0.5rem)]">
      <BusinessHeader
        ownerName="Samira"
        ownerRole="Admin"
        businessName="Yapass"
      />

      <div className="flex flex-1 flex-col gap-5 px-4 pt-2">
        <Card variant="elevated" padding="lg" className="flex flex-col gap-4">
          <h1 className="text-title-sm text-primary">
            Ventas Semana del 13 al 19 de abril
          </h1>
          <ChartWithValueLabels data={WEEK} />
        </Card>
      </div>

      <div className="sticky bottom-(--app-bottom-nav-height) mt-4 border-t border-divider bg-surface-alt px-4 py-3">
        <Button label="Volver" size="lg" onClick={() => router.back()} />
      </div>
    </div>
  );
}

/**
 * The Figma chart shows the dollar value above each bar. `BarChart`
 * doesn't render value labels, so we wrap it with a small overlay that
 * positions a `$X` caption above each column proportional to its
 * height. Done with absolute positioning so the SVG itself stays
 * untouched and reusable elsewhere.
 */
function ChartWithValueLabels({
  data,
}: {
  data: readonly BarChartDatum[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="relative">
      <BarChart data={data} height={300} />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[272px] items-end justify-around px-1">
        {data.map((d) => {
          const ratio = d.value / max;
          // Slight nudge above the bar so labels sit cleanly on top.
          const bottom = `calc(${ratio * 100}% + 4px)`;
          return (
            <span
              key={d.label}
              className="absolute -translate-x-1/2 text-[11px] font-semibold text-text-secondary"
              style={{
                left: `${((data.indexOf(d) + 0.5) / data.length) * 100}%`,
                bottom,
              }}
            >
              ${d.value}
            </span>
          );
        })}
      </div>
    </div>
  );
}
