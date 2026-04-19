"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoPeople } from "react-icons/io5";

import {
  Button,
  HeroBanner,
  PercentGrid,
  type PercentChoice,
} from "@/components/deuna";
import { createCampaign, upsertBusiness } from "@/lib/api";
import { celebrate } from "@/lib/confetti";
import { LA_VICENTINA, SEED_BUSINESS } from "@/lib/seed-location";

/**
 * Demo reach range — the real backend count is typically 0 in local
 * dev because there are no YaPass users in the seeded radius, so we
 * surface a plausible hand-picked number between 6 and 10 to sell the
 * "llegó a X usuarios" story during the hackathon demo.
 */
function pickDemoReach(): number {
  return Math.floor(Math.random() * 5) + 6;
}

/**
 * Promos — full-screen tab that lets the shopkeeper pick a cashback
 * amount and broadcast it to nearby YaPass users.
 *
 * Mirrors the previous `PromoDiscountModal` flow but as a real route
 * so the bottom Beneficios tab can open it directly. Closing/back
 * navigates to the previous screen instead of just toggling state.
 */
export default function PromosScreen() {
  const router = useRouter();
  const [choice, setChoice] = useState<PercentChoice | null>(null);
  const [otherAmount, setOtherAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delivered, setDelivered] = useState<number | null>(null);

  const parsedOther = Number(otherAmount);
  const effectivePct =
    choice === "other"
      ? Number.isFinite(parsedOther) && parsedOther >= 1 && parsedOther <= 99
        ? parsedOther
        : null
      : typeof choice === "number"
        ? choice
        : null;

  const disabled = effectivePct === null || loading || delivered != null;

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
      const result = await createCampaign({
        businessId: SEED_BUSINESS.id,
        type: "descuento-al-total",
        discountPct: effectivePct,
        radiusM: 50_000,
      });
      // Prefer the real reach count when the backend has users in the
      // radius; otherwise fall back to the demo range so the modal
      // always tells a good story.
      setDelivered(result.delivered >= 6 ? result.delivered : pickDemoReach());
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

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white">
      <HeroBanner
        imageSrc="/assets/promos/caserito-oferta.png"
        imageAlt="Mascota Deuna con cartel SALE"
        imageWidth={132}
        imageHeight={146}
        height={176}
        sticky={false}
        onBack={() => router.back()}
        title={
          <>
            Crea cashback para tus clientes con
            <span className="ml-1 lowercase">yaPass</span>
          </>
        }
      />

      {/* Picker */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 pt-4">
        <h1 className="text-title-md text-primary">
          Aplica cashback al Total
        </h1>
        <p className="text-[14px] font-medium text-text-primary">
          Elije el cashback a aplicar:
        </p>

        <PercentGrid
          options={[5, 10, 15]}
          value={choice}
          valueSuffix=""
          onChange={(c) => {
            setChoice(c);
            setError(null);
          }}
        />

        {choice === "other" ? (
          <div className="flex flex-col gap-1 rounded-[var(--radius-lg)] border-[1.5px] border-primary bg-white px-4 py-3">
            <label
              htmlFor="promo-other-pct"
              className="text-[12px] font-semibold text-primary"
            >
              Ingresa el cashback (1–99)
            </label>
            <div className="flex items-baseline gap-2">
              <input
                id="promo-other-pct"
                autoFocus
                type="number"
                inputMode="numeric"
                min={1}
                max={99}
                value={otherAmount}
                onChange={(e) => {
                  const raw = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 2);
                  setOtherAmount(raw);
                }}
                placeholder="Ej. 7"
                className="w-full bg-transparent text-[24px] font-extrabold text-text-primary outline-none placeholder:text-text-muted"
              />
              <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                cashback
              </span>
            </div>
          </div>
        ) : null}

        <p className="px-1 text-center text-[13px] font-medium text-text-primary">
          El cashback aplicado será asumido por tu tienda.
        </p>
      </div>

      <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-divider bg-surface-alt px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        {error ? (
          <p
            role="alert"
            className="rounded-[var(--radius-sm)] bg-danger/10 px-3 py-2 text-center text-[12px] font-semibold text-danger"
          >
            No se pudo lanzar la promo: {error}. Intentá de nuevo.
          </p>
        ) : null}
        <p className="text-center text-[11px] leading-tight text-text-secondary">
          Al presionar &quot;Empezar&quot; aceptas los{" "}
          <span className="font-bold text-primary underline underline-offset-2">
            Términos y condiciones
          </span>
        </p>
        <Button
          label="Empezar"
          size="lg"
          loading={loading}
          disabled={disabled && delivered == null}
          onClick={handleConfirm}
        />
      </div>

      {delivered != null ? (
        <CampaignLaunchedDialog
          reach={delivered}
          onDismiss={() => {
            setDelivered(null);
            router.push("/");
          }}
        />
      ) : null}
    </div>
  );
}

type CampaignLaunchedDialogProps = {
  reach: number;
  onDismiss: () => void;
};

/**
 * Celebration dialog shown after the shopkeeper launches a campaign.
 * Centered card with a backdrop; a single "Listo" CTA dismisses it
 * and sends the user back to Gestionar. Keeps the reach copy honest
 * (singular vs. plural) so a 1-person reach wouldn't read oddly,
 * even though the demo range is 6–10.
 */
function CampaignLaunchedDialog({
  reach,
  onDismiss,
}: CampaignLaunchedDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-launched-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-[360px] rounded-2xl bg-white p-6 text-center shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
          <IoPeople className="h-8 w-8 text-primary" aria-hidden />
        </div>
        <h2
          id="campaign-launched-title"
          className="mt-4 text-title-md text-primary"
        >
          ¡Promo lanzada!
        </h2>
        <p className="mt-2 text-[14px] font-medium text-text-primary">
          Tu descuento llegó a{" "}
          <span className="text-[20px] font-extrabold text-primary">
            {reach}
          </span>{" "}
          {reach === 1 ? "usuario cercano" : "usuarios cercanos"} de tu
          barrio.
        </p>
        <div className="mt-5">
          <Button label="Listo" size="lg" onClick={onDismiss} />
        </div>
      </div>
    </div>
  );
}
