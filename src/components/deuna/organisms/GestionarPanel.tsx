"use client";

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
  /** Balance shown by the top `BalanceCard` (masked by default). */
  balance?: number;
  /** Pending amount to receive — hidden when omitted. */
  pending?: number;
};

/**
 * Organism — Gestionar panel: balance card, 4-up quick-action grid and
 * a horizontal "Novedades" carousel. Every item is a molecule; this
 * organism only supplies the layout and the static business copy.
 */
export function GestionarPanel({
  balance = 0,
  pending,
}: GestionarPanelProps = {}) {
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
        <div className="grid grid-cols-2 gap-3">
          <NewsCard
            tone="teal"
            title="Agrega vendedores a tu equipo"
            brand="deuna!"
          />
          <NewsCard
            tone="teal"
            title="Administra tus ventas con tu caja"
            brand="deuna!"
          />
        </div>
      </section>
    </div>
  );
}
