"use client";

import { useState } from "react";

import {
  BusinessHeader,
  CobrarPanel,
  GestionarPanel,
  SegmentedTabs,
} from "@/components/deuna";

type InicioTab = "cobrar" | "gestionar";

const TABS = [
  { id: "cobrar" as const, label: "Cobrar" },
  { id: "gestionar" as const, label: "Gestionar" },
];

/**
 * Pantalla única del admin de Deuna Negocios. Compone:
 *
 *   BusinessHeader      ← organism (top bar)
 *   SegmentedTabs       ← molecule (Cobrar / Gestionar)
 *     ├── CobrarPanel   ← organism
 *     └── GestionarPanel← organism
 *
 * Toda la lógica de UI vive dentro de los organismos; esta página es
 * sólo el switcher de alto nivel entre los dos paneles.
 */
export default function InicioScreen() {
  const [tab, setTab] = useState<InicioTab>("cobrar");

  return (
    <div className="flex flex-col pt-[max(env(safe-area-inset-top),0.5rem)]">
      <BusinessHeader
        ownerName="Julian"
        ownerRole="Admin"
        businessName="Yapass"
      />

      <SegmentedTabs
        items={TABS}
        value={tab}
        onChange={setTab}
        variant="underline"
        ariaLabel="Vista principal"
        className="px-4"
      />

      <div className="pt-3">
        {tab === "cobrar" ? (
          <CobrarPanel
            initialAmount="20"
            onContinue={({ amount, method }) => {
              console.info("continuar cobrar", { amount, method });
            }}
          />
        ) : (
          <GestionarPanel balance={1000.5} pending={481.03} />
        )}
      </div>
    </div>
  );
}
