"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import QRCode from "react-qr-code";
import { IoLockClosedOutline } from "react-icons/io5";

import {
  ADMIN_QR_PAYLOAD,
  isAdminUnlocked,
  matchesAdminCode,
  subscribeAdminAccess,
  unlockAdmin,
} from "@/lib/admin-access";

import { Button } from "../atoms/Button";

export type AdminAccessGateProps = {
  children: React.ReactNode;
};

/**
 * Organism — boot-time gate for the Deuna Negocios admin console.
 * Subscribes to the admin-access store via `useSyncExternalStore` so
 * the gate reacts atomically both to in-tab unlocks and cross-tab
 * mutations. Server snapshot is `false` (locked) so a regular shopper
 * who somehow lands on the URL sees the login screen, not a flash of
 * the admin UI.
 */
export function AdminAccessGate({ children }: AdminAccessGateProps) {
  const unlocked = useSyncExternalStore(
    subscribeAdminAccess,
    isAdminUnlocked,
    () => false,
  );

  if (unlocked) {
    return <>{children}</>;
  }

  return <AccessCodeScreen onUnlock={unlockAdmin} />;
}

type AccessCodeScreenProps = {
  onUnlock: () => void;
};

function AccessCodeScreen({ onUnlock }: AccessCodeScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchesAdminCode(code)) {
      setError(null);
      onUnlock();
    } else {
      setError("Código inválido. Probá de nuevo.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-1 flex-col bg-background">
      <section className="flex flex-col items-center gap-4 bg-primary-soft px-5 pt-10 pb-6 text-center">
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
          <IoLockClosedOutline aria-hidden className="h-3.5 w-3.5" />
          <span>Solo comercios</span>
        </div>
        <div className="relative h-[120px] w-[120px]">
          <Image
            src="/assets/mascota.png"
            alt="Mascota Deuna Negocios"
            fill
            sizes="120px"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-title-lg text-primary">Deuna Negocios</h1>
          <p className="text-[13px] font-medium leading-snug text-text-secondary">
            Esta consola es para comerciantes. Escaneá el QR o ingresá tu
            código para continuar.
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 px-5 py-6">
        <div
          className="flex flex-col items-center gap-2 rounded-[var(--radius-lg)] bg-white p-4 shadow-[var(--shadow-card)]"
          aria-label="Código QR de acceso"
        >
          <QRCode
            value={ADMIN_QR_PAYLOAD}
            size={176}
            level="M"
            bgColor="#ffffff"
            fgColor="#4b1d8c"
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary">
            Código para ingresar
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3"
          noValidate
        >
          <label
            htmlFor="admin-code"
            className="text-[12px] font-bold uppercase tracking-[0.12em] text-text-secondary"
          >
            Ingresá tu código
          </label>
          <input
            id="admin-code"
            name="admin-code"
            type="text"
            inputMode="text"
            autoComplete="one-time-code"
            spellCheck={false}
            autoFocus
            value={code}
            maxLength={16}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            placeholder="••••"
            className="w-full rounded-[var(--radius-md)] border border-divider bg-white px-4 py-3 text-center text-[22px] font-extrabold tracking-[0.3em] text-primary outline-none placeholder:text-text-muted focus:border-primary"
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? "admin-code-error" : undefined}
          />
          {error ? (
            <p
              id="admin-code-error"
              role="alert"
              className="text-center text-[12px] font-semibold text-danger"
            >
              {error}
            </p>
          ) : null}
          <Button
            label="Ingresar"
            size="lg"
            type="submit"
            disabled={code.trim().length === 0}
          />
        </form>

        <p className="text-center text-[11px] font-medium leading-snug text-text-muted">
          ¿No tenés un código? Pedile al administrador de tu comercio que
          te comparta el QR desde su cuenta.
        </p>
      </section>
    </div>
  );
}
