"use client";

import { useState } from "react";

import { createCampaign, upsertBusiness } from "@/lib/api";
import { celebrate } from "@/lib/confetti";
import { LA_VICENTINA, SEED_BUSINESS } from "@/lib/seed-location";

import { Button } from "../atoms/Button";
import { SuccessCheck } from "../atoms/SuccessCheck";
import { Card } from "../molecules/Card";
import { PercentGrid, type PercentChoice } from "../molecules/PercentGrid";
import { PromoBanner } from "../molecules/PromoBanner";
import { ReachCard } from "../molecules/ReachCard";
import { Modal } from "./Modal";

export type PromoDiscountModalProps = {
  open: boolean;
  onClose: () => void;
  brand?: string;
  bannerImageSrc?: string;
  options?: readonly number[];
  title?: string;
  helper?: string;
  smallPrint?: string;
  ctaLabel?: string;
  /** Broadcast radius in meters. Defaults to 800. */
  radiusM?: number;
};

/**
 * Organism — full-screen sheet that asks the shopkeeper to pick a
 * discount percentage backed by a brand partner (e.g. Netlife). Owns
 * the full launch flow end-to-end: picker → async POST → success
 * state with the real delivered count. Closing the modal resets
 * everything, because the inner content only mounts while `open`.
 */
export function PromoDiscountModal({
  open,
  onClose,
  brand = "Netlife",
  bannerImageSrc = "/assets/mascota.png",
  options = [5, 10, 15],
  title = "Aplica un descuento al Total",
  helper = "Elije el porcentaje a aplicar:",
  smallPrint = "El descuento aplicado será asumido por tu tienda.",
  ctaLabel = "Empezar",
  radiusM = 800,
}: PromoDiscountModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Promos">
      {open ? (
        <PromoDiscountContent
          onClose={onClose}
          brand={brand}
          bannerImageSrc={bannerImageSrc}
          options={options}
          title={title}
          helper={helper}
          smallPrint={smallPrint}
          ctaLabel={ctaLabel}
          radiusM={radiusM}
        />
      ) : null}
    </Modal>
  );
}

type PromoDiscountContentProps = {
  onClose: () => void;
  brand: string;
  bannerImageSrc: string;
  options: readonly number[];
  title: string;
  helper: string;
  smallPrint: string;
  ctaLabel: string;
  radiusM: number;
};

type LaunchResult = {
  delivered: number;
  percent: number;
};

function PromoDiscountContent({
  onClose,
  brand,
  bannerImageSrc,
  options,
  title,
  helper,
  smallPrint,
  ctaLabel,
  radiusM,
}: PromoDiscountContentProps) {
  const [choice, setChoice] = useState<PercentChoice | null>(null);
  const [otherPct, setOtherPct] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaunchResult | null>(null);

  const parsedOther = Number(otherPct);
  const effectivePct =
    choice === "other"
      ? Number.isFinite(parsedOther) &&
        parsedOther >= 1 &&
        parsedOther <= 99
        ? parsedOther
        : null
      : typeof choice === "number"
        ? choice
        : null;

  const disabled = effectivePct === null || loading;

  const handleChoice = (next: PercentChoice): void => {
    setChoice(next);
    setError(null);
  };

  const handleConfirm = async (): Promise<void> => {
    if (effectivePct === null || loading) return;
    setError(null);
    setLoading(true);
    celebrate();
    try {
      await upsertBusiness({
        id: SEED_BUSINESS.id,
        name: SEED_BUSINESS.name,
        ownerName: SEED_BUSINESS.ownerName,
        barrio: SEED_BUSINESS.barrio,
        location: LA_VICENTINA,
      });
      const { delivered } = await createCampaign({
        businessId: SEED_BUSINESS.id,
        type: "descuento-al-total",
        discountPct: effectivePct,
        radiusM,
      });
      setResult({ delivered, percent: effectivePct });
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      const friendly = /failed to fetch|networkerror/i.test(raw)
        ? "No hay conexión con el servidor"
        : raw;
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <PromoLaunchSuccess
        brand={brand}
        delivered={result.delivered}
        percent={result.percent}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 px-4 pt-3">
        <PromoBanner brand={brand} imageSrc={bannerImageSrc} />

        <div className="flex flex-col gap-1">
          <h3 className="text-title-md text-primary">{title}</h3>
          <p className="text-[13px] font-medium text-text-secondary">
            {helper}
          </p>
        </div>

        <PercentGrid
          options={options}
          value={choice}
          onChange={handleChoice}
        />

        {choice === "other" ? (
          <div className="flex flex-col gap-1 rounded-[var(--radius-lg)] border-[1.5px] border-primary bg-white px-4 py-3">
            <label
              htmlFor="promo-other-pct"
              className="text-[12px] font-semibold text-primary"
            >
              Ingresa el porcentaje (1–99)
            </label>
            <div className="flex items-baseline gap-2">
              <input
                id="promo-other-pct"
                autoFocus
                type="number"
                inputMode="numeric"
                min={1}
                max={99}
                value={otherPct}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                  setOtherPct(raw);
                }}
                placeholder="Ej. 7"
                className="w-full bg-transparent text-[28px] font-extrabold text-text-primary outline-none placeholder:text-text-muted"
              />
              <span className="text-[24px] font-extrabold text-text-primary">
                %
              </span>
            </div>
          </div>
        ) : null}

        {smallPrint ? (
          <p className="px-1 text-center text-[12px] font-medium text-text-secondary">
            {smallPrint}
          </p>
        ) : null}
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-divider bg-surface-alt px-4 py-3">
        {error ? (
          <p
            role="alert"
            className="rounded-[var(--radius-sm)] bg-danger/10 px-3 py-2 text-center text-[12px] font-semibold text-danger"
          >
            No se pudo lanzar la promo: {error}. Intentá de nuevo.
          </p>
        ) : null}
        <p className="text-center text-[11px] text-text-secondary">
          Al presionar &quot;{ctaLabel}&quot; aceptas los{" "}
          <span className="font-bold text-primary underline underline-offset-2">
            Términos y condiciones
          </span>
        </p>
        <Button
          label={ctaLabel}
          size="lg"
          loading={loading}
          disabled={disabled}
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
}

type PromoLaunchSuccessProps = {
  brand: string;
  delivered: number;
  percent: number;
  onClose: () => void;
};

/** Success step shown in-place once the campaign was accepted by the
 *  API. Kept inside `PromoDiscountModal` so the launch flow is fully
 *  self-contained — the owner reads the affordance and taps "Listo"
 *  to dismiss, without bouncing between modals. */
function PromoLaunchSuccess({
  brand,
  delivered,
  percent,
  onClose,
}: PromoLaunchSuccessProps) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-stretch gap-4 px-4 pt-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <SuccessCheck size="lg" />
          <div className="flex flex-col gap-1">
            <h3 className="text-title-lg text-primary">¡Promo lanzada!</h3>
            <p className="text-[14px] font-semibold text-text-secondary">
              Aplicaste {percent}% con {brand}
            </p>
          </div>
        </div>

        <ReachCard delivered={delivered} />

        <Card
          variant="flat"
          padding="md"
          className="bg-primary-soft text-center"
        >
          <p className="text-[12px] font-medium leading-snug text-primary">
            Revisá la vista <span className="font-bold">Estadísticas</span>{" "}
            cuando quieras ver el impacto en tus ventas.
          </p>
        </Card>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-divider bg-surface-alt px-4 py-3">
        <Button label="Listo" size="lg" onClick={onClose} />
      </div>
    </div>
  );
}
