"use client";

import { useRouter } from "next/navigation";
import {
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoCashOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

import { BalanceCard } from "../molecules/BalanceCard";
import { NewsCard } from "../molecules/NewsCard";
import { QuickAction } from "../molecules/QuickAction";

export type GestionarPanelProps = {
  balance?: number;
  pending?: number;
};

/**
 * Organism — Gestionar panel: balance card, quick-action grid and a
 * 2-column "Novedades" shelf ("hielera"). Each news card is an
 * independent entry point that deep-links into a dedicated route
 * (`/promos`, `/estadisticas`, `/desafios`); the panel itself is
 * purely presentational now that the flows live as full screens.
 * Cards render in their compact `square` form so two fit per row.
 */
export function GestionarPanel({
  balance = 0,
  pending,
}: GestionarPanelProps = {}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 px-4 pt-2 pb-4">
      <BalanceCard
        balance={balance}
        pending={pending}
        defaultVisible={false}
        onPress={() => {
          /* mockup — hook up to the real balance detail screen */
        }}
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-title-sm text-primary">Accesos rápidos</h2>
        <div className="grid grid-cols-4 gap-y-4">
          <QuickAction
            label="Recargar saldo"
            icon={IoArrowDownOutline}
            tone="primary"
          />
          <QuickAction
            label="Transferir saldo"
            icon={IoArrowUpOutline}
            tone="primary"
          />
          <QuickAction
            label="Venta Manual"
            icon={IoCashOutline}
            tone="primary"
          />
          <QuickAction
            label="Verificar pago"
            icon={IoShieldCheckmarkOutline}
            tone="primary"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-title-sm text-primary">Novedades Deuna Negocios</h2>
        <div className="grid grid-cols-2 gap-3" role="list">
          {/* Real, navegables: van primero porque son los flows
              implementados que el shopkeeper va a usar día a día. */}
          <div role="listitem">
            <NewsCard
              tone="teal"
              title="Lanzar Promociones"
              brand="deuna!"
              onPress={() => router.push("/promos")}
            />
          </div>
          <div role="listitem">
            <NewsCard
              tone="teal"
              title="Estadísticas"
              brand="deuna!"
              onPress={() => router.push("/estadisticas")}
            />
          </div>
          <div role="listitem">
            <NewsCard
              tone="lavender"
              title="Desafíos y Premios"
              brand="deuna!"
              onPress={() => router.push("/desafios")}
            />
          </div>
          {/* Placeholders del mockup original — sin handler aún, se
              quedan al final hasta que tengan pantalla propia. */}
          <div role="listitem">
            <NewsCard
              tone="teal"
              title="Agrega vendedores a tu equipo"
              brand="deuna!"
            />
          </div>
          <div role="listitem">
            <NewsCard
              tone="teal"
              title="Administra tus ventas con tu caja"
              brand="deuna!"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
