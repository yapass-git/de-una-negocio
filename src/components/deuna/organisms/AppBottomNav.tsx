"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  IoHome,
  IoHomeOutline,
  IoMenuOutline,
  IoWallet,
  IoWalletOutline,
} from "react-icons/io5";

import { cn } from "@/lib/cn";

type IconComp = ComponentType<SVGProps<SVGSVGElement>>;

export type AppBottomNavTabId = "inicio" | "mi-caja" | "menu";

type TabDef = {
  id: AppBottomNavTabId;
  label: string;
  href: string;
  ActiveIcon: IconComp;
  InactiveIcon: IconComp;
};

const TABS: TabDef[] = [
  {
    id: "inicio",
    label: "Inicio",
    href: "/",
    ActiveIcon: IoHome,
    InactiveIcon: IoHomeOutline,
  },
  {
    id: "mi-caja",
    label: "Mi Caja",
    href: "/",
    ActiveIcon: IoWallet,
    InactiveIcon: IoWalletOutline,
  },
  {
    id: "menu",
    label: "Menú",
    href: "/",
    ActiveIcon: IoMenuOutline,
    InactiveIcon: IoMenuOutline,
  },
];

export type AppBottomNavProps = {
  /** Currently highlighted tab. Defaults to "inicio". */
  active?: AppBottomNavTabId;
  className?: string;
};

/**
 * Organism — fixed bottom tab bar with three entries (Inicio · Mi Caja
 * · Menú). Every tab currently points at `/` because only the Inicio
 * screen is implemented; the other tabs stay visible so the shell
 * matches the reference UI without leading users into 404s.
 */
export function AppBottomNav({ active = "inicio", className }: AppBottomNavProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        "fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2",
        "border-t border-divider bg-white px-2 pt-1 pb-[max(env(safe-area-inset-bottom),0.25rem)]",
        className,
      )}
    >
      <ul className="flex h-16 items-center justify-around">
        {TABS.map(({ id, label, href, ActiveIcon, InactiveIcon }) => {
          const isActive = id === active;
          const Icon = isActive ? ActiveIcon : InactiveIcon;
          return (
            <li key={id} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-1 text-[11px] font-semibold transition-colors",
                  isActive ? "text-primary" : "text-text-muted",
                )}
              >
                <Icon className="h-[22px] w-[22px]" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
