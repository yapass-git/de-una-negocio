"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";

import {
  Button,
  IconButton,
  PercentGrid,
  type PercentChoice,
} from "@/components/deuna";
import { createCampaign, upsertBusiness } from "@/lib/api";
import { celebrate } from "@/lib/confetti";
import { LA_VICENTINA, SEED_BUSINESS } from "@/lib/seed-location";

/**
 * Promos — full-screen tab that lets the shopkeeper pick a discount
 * percentage and broadcast it to nearby YaPass users.
 *
 * Mirrors the previous `PromoDiscountModal` flow but as a real route
 * so the bottom Beneficios tab can open it directly. Closing/back
 * navigates to the previous screen instead of just toggling state.
 */
export default function PromosScreen() {
  const router = useRouter();
  const [choice, setChoice] = useState<PercentChoice | null>(null);
  const [otherPct, setOtherPct] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delivered, setDelivered] = useState<number | null>(null);

  const parsedOther = Number(otherPct);
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
      setDelivered(result.delivered);
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
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero — lavender card with the SALE mascot and a back arrow. */}
      <section className="relative h-[202px] w-full overflow-hidden bg-gradient-to-b from-[#f6eeff] to-[#e7dcf2] pt-[max(env(safe-area-inset-top),0.5rem)]">
        <IconButton
          aria-label="Volver"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="absolute left-2 top-3 z-10 text-primary"
          icon={<IoArrowBack className="h-5 w-5" />}
        />

        <div className="relative flex h-full items-center">
          <div className="relative h-[167px] w-[145px] shrink-0 pl-3">
            <Image
              src="/assets/promos/caserito-oferta.png"
              alt="Mascota Deuna con cartel SALE"
              fill
              sizes="145px"
              className="object-contain"
              priority
            />
          </div>
          <p className="pr-4 text-[22px] font-extrabold leading-[26px] text-primary">
            Crea descuentos para tus clientes con
            <span className="ml-1 lowercase">yaPass</span>
          </p>
        </div>
      </section>

      {/* Picker */}
      <div className="flex flex-1 flex-col gap-4 px-4 pt-6">
        <h1 className="text-title-md text-primary">
          Aplica un descuento al Total
        </h1>
        <p className="text-[14px] font-medium text-text-primary">
          Elije el porcentaje a aplicar:
        </p>

        <PercentGrid
          options={[5, 10, 15]}
          value={choice}
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
                  const raw = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 2);
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

        <p className="px-1 text-center text-[14px] font-medium text-text-primary">
          El descuento aplicado será asumido por tu tienda.
        </p>

        {delivered != null ? (
          <div className="rounded-[var(--radius-md)] bg-accent-green-soft px-4 py-3 text-center">
            <p className="text-[14px] font-bold text-accent-green">
              ¡Promo lanzada! Llegó a {delivered}{" "}
              {delivered === 1 ? "usuario cercano" : "usuarios cercanos"}.
            </p>
          </div>
        ) : null}
      </div>

      {/* Sticky CTA — pinned above the bottom nav using the global
          `--app-bottom-nav-height` token so the button can never get
          covered by the tab bar (or by the device's bottom safe-area). */}
      <div className="sticky bottom-(--app-bottom-nav-height) mt-4 flex flex-col gap-2 border-t border-divider bg-surface-alt px-4 py-3">
        {error ? (
          <p
            role="alert"
            className="rounded-[var(--radius-sm)] bg-danger/10 px-3 py-2 text-center text-[12px] font-semibold text-danger"
          >
            No se pudo lanzar la promo: {error}. Intentá de nuevo.
          </p>
        ) : null}
        <p className="text-center text-[11px] text-text-secondary">
          Al presionar &quot;Empezar&quot; aceptas los{" "}
          <span className="font-bold text-primary underline underline-offset-2">
            Términos y condiciones
          </span>
        </p>
        <Button
          label={delivered != null ? "Listo" : "Empezar"}
          size="lg"
          loading={loading}
          disabled={disabled && delivered == null}
          onClick={delivered != null ? () => router.back() : handleConfirm}
        />
      </div>
    </div>
  );
}
