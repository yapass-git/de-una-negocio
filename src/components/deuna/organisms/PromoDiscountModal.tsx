"use client";

import { useState, type MouseEvent } from "react";

import type { Campaign } from "@/lib/api-types";
import { createCampaign, upsertBusiness } from "@/lib/api";
import { celebrate, spark } from "@/lib/confetti";
import { LA_VICENTINA, SEED_BUSINESS } from "@/lib/seed-location";

import { Button } from "../atoms/Button";
import { PercentGrid, type PercentChoice } from "../molecules/PercentGrid";
import { PromoBanner } from "../molecules/PromoBanner";
import { Modal } from "./Modal";

export type PromoDiscountPayload = {
  /** Final campaign as stored by the backend. */
  campaign: Campaign;
  /** Nearby users that had an open EventSource at broadcast time. */
  delivered: number;
  /** Effective percent applied (preset or OTRO). */
  percent: number;
};

export type PromoDiscountModalProps = {
  open: boolean;
  onClose: () => void;
  /** Fired with the successful API response after "Empezar". */
  onConfirm: (payload: PromoDiscountPayload) => void;
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
 * discount percentage backed by a brand partner (e.g. Netlife). Also
 * owns the async launch: ensures the business exists on the API and
 * fires `POST /campaigns` with the chosen percent. The inner content
 * only mounts while the modal is open, which resets the selection
 * between openings without needing a clearing effect.
 */
export function PromoDiscountModal({
  open,
  onClose,
  onConfirm,
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
          onConfirm={onConfirm}
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

type PromoDiscountContentProps = Required<
  Pick<
    PromoDiscountModalProps,
    | "onConfirm"
    | "brand"
    | "bannerImageSrc"
    | "options"
    | "title"
    | "helper"
    | "smallPrint"
    | "ctaLabel"
    | "radiusM"
  >
>;

/** Resolves a normalized confetti origin from a click event. Returns
 *  `undefined` if coords look bogus so the helper falls back to its
 *  default center burst. */
function originFromClick(event: MouseEvent): { x: number; y: number } | undefined {
  if (typeof window === "undefined") return undefined;
  const { clientX, clientY } = event;
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return undefined;
  return { x: clientX / w, y: clientY / h };
}

function PromoDiscountContent({
  onConfirm,
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

  const handleChoice = (next: PercentChoice, event?: MouseEvent): void => {
    setChoice(next);
    setError(null);
    spark(event ? originFromClick(event) : undefined);
  };

  const handleConfirm = async (event: MouseEvent): Promise<void> => {
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
      const { campaign, delivered } = await createCampaign({
        businessId: SEED_BUSINESS.id,
        type: "descuento-al-total",
        discountPct: effectivePct,
        radiusM,
      });
      onConfirm({ campaign, delivered, percent: effectivePct });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de red";
      setError(msg);
      void event;
    } finally {
      setLoading(false);
    }
  };

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
                  if (raw.length > 0) spark();
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
