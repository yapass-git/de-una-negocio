"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/deuna";

/**
 * Desafíos — listing of all active challenges for the shopkeeper.
 *
 * Each card is its own entry point that deep-links into a detail
 * screen at `/desafios/{slug}`. The third card is a "sponsored"
 * challenge (Alpina) that shows the partner badge.
 */
export default function DesafiosScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero — lavender card with the trophy mascot. The Beneficios
          tab in the bottom nav already lights up here, so the back
          arrow that used to live in the top-left corner is gone: the
          shopkeeper navigates between tabs via the navbar instead. */}
      <section className="relative h-[202px] w-full overflow-hidden bg-gradient-to-b from-[#f6eeff] to-[#e7dcf2] pt-[max(env(safe-area-inset-top),0.5rem)]">
        <div className="relative flex h-full items-center">
          <div className="relative h-[175px] w-[151px] shrink-0 pl-3">
            <Image
              src="/assets/desafios/trophy-mascot.png"
              alt="Mascota Deuna con un trofeo"
              fill
              sizes="151px"
              className="object-contain"
              priority
            />
          </div>
          <p className="pr-4 text-[22px] font-extrabold leading-[26px] text-primary">
            Gana beneficios cumpliendo desafíos
          </p>
        </div>
      </section>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-4 px-4 pt-4">
        <DesafioCard
          slug="dos"
          title="¡Estás en el puesto #3 de comercios con más favoritos de Quito!"
          subtitle="Llega al top #1 para ganar un viaje a Tonsupa"
        />

        <DesafioCard
          slug="tres"
          title="¡Felicidades! Eres el top #1 de comercios con más visitantes en tu barrio."
          subtitle="Pulsa aquí para que tu local sea promocionado en las misiones semanales."
        />

        <DesafioCard
          slug="uno"
          title="Vende $500 y gana premios"
          variant="sponsored"
          progress={{ current: 0, total: 500 }}
          sponsor={{
            name: "Alpina",
            logoSrc: "/assets/alpina/logo.png",
          }}
        />
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-(--app-bottom-nav-height) mt-6 border-t border-divider bg-surface-alt px-4 py-3">
        <Button
          label="Empezar"
          size="lg"
          onClick={() => router.push("/desafios/uno")}
        />
      </div>
    </div>
  );
}

type DesafioCardProps = {
  slug: "uno" | "dos" | "tres";
  title: string;
  subtitle?: string;
  variant?: "default" | "sponsored";
  progress?: { current: number; total: number };
  sponsor?: { name: string; logoSrc: string };
};

/**
 * Card-link shared by the three rows. The sponsored variant shows a
 * progress bar with the brand chip on the right; the default variant
 * is a centered title with optional subtitle. Tapping anywhere drives
 * to the detail route.
 */
function DesafioCard({
  slug,
  title,
  subtitle,
  variant = "default",
  progress,
  sponsor,
}: DesafioCardProps) {
  return (
    <Link
      href={`/desafios/${slug}`}
      className="block rounded-[20px] border border-white bg-white p-4 shadow-[0_0_4px_0_rgba(0,0,0,0.25)] transition-transform active:scale-[0.99]"
    >
      {variant === "sponsored" ? (
        <SponsoredCardBody
          title={title}
          progress={progress}
          sponsor={sponsor}
        />
      ) : (
        <DefaultCardBody title={title} subtitle={subtitle} />
      )}
    </Link>
  );
}

function DefaultCardBody({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h3 className="text-[15px] font-extrabold leading-[18px] text-primary">
        {title}
      </h3>
      {subtitle ? (
        <p className="text-[12.8px] font-medium leading-[15px] text-text-primary">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function SponsoredCardBody({
  title,
  progress,
  sponsor,
}: {
  title: string;
  progress?: { current: number; total: number };
  sponsor?: { name: string; logoSrc: string };
}) {
  const ratio = progress
    ? Math.min(1, Math.max(0, progress.current / progress.total))
    : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-center text-[15px] font-extrabold leading-[18px] text-primary">
          {title}
        </h3>

        {progress ? (
          <div className="flex items-center gap-2">
            <div className="relative h-[3px] flex-1 rounded-full bg-text-muted/40">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
            <span className="shrink-0 text-[12px] font-medium text-text-primary">
              {progress.current === 0 ? "0" : `$${progress.current}`}/$
              {progress.total}
            </span>
          </div>
        ) : null}
      </div>

      {sponsor ? (
        <div
          className="relative h-10 w-11 shrink-0 overflow-hidden rounded-[9.7px]"
          style={{ boxShadow: "0 3.6px 3.6px rgba(0,0,0,0.4)" }}
          aria-label={`Sponsored por ${sponsor.name}`}
        >
          <Image
            src={sponsor.logoSrc}
            alt={sponsor.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
