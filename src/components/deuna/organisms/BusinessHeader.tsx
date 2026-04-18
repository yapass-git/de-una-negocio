"use client";

import {
  IoHeadsetOutline,
  IoNotificationsOutline,
  IoQrCodeOutline,
} from "react-icons/io5";

import { cn } from "@/lib/cn";
import { Avatar } from "../atoms/Avatar";
import { Badge } from "../atoms/Badge";
import { IconButton } from "../atoms/IconButton";

export type BusinessHeaderProps = {
  /** Display name of the owner (e.g. "Julian"). Rendered as `Hola! {name}`. */
  ownerName: string;
  /** Role pill shown right next to the name ("Admin", "Vendedor", …). */
  ownerRole?: string;
  /** Sub-line under the greeting — typically the brand or business name. */
  businessName: string;
  /** Unread-notifications indicator on the bell icon. */
  notificationCount?: number;
  onScanPress?: () => void;
  onBellPress?: () => void;
  onSupportPress?: () => void;
  className?: string;
};

/**
 * Organism — top bar of the admin app. Layout:
 *
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ [J]  Hola! Julian  (Admin)        [QR] [🔔] [🎧]             │
 *   │      Yapass                                                  │
 *   └───────────────────────────────────────────────────────────────┘
 *
 * Every piece composes an atom: `Avatar`, `Badge`, `IconButton`. No
 * inline styling or state — callbacks are wired by the parent.
 */
export function BusinessHeader({
  ownerName,
  ownerRole,
  businessName,
  notificationCount = 0,
  onScanPress,
  onBellPress,
  onSupportPress,
  className,
}: BusinessHeaderProps) {
  return (
    <header
      className={cn("flex items-center gap-3 px-4 pt-3 pb-3", className)}
    >
      <Avatar name={ownerName} size="md" ringClassName="" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate text-title-sm text-primary">
            ¡Hola! {ownerName}
          </span>
          {ownerRole ? (
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
              {ownerRole}
            </span>
          ) : null}
        </div>
        <span className="truncate text-[12px] font-medium text-text-secondary">
          {businessName}
        </span>
      </div>

      <div className="relative flex shrink-0 items-center gap-0.5">
        <IconButton
          aria-label="Escanear QR"
          onClick={onScanPress}
          variant="ghost"
          size="sm"
          icon={<IoQrCodeOutline className="h-[22px] w-[22px] text-primary" />}
        />
        <IconButton
          aria-label="Notificaciones"
          onClick={onBellPress}
          variant="ghost"
          size="sm"
          icon={
            <IoNotificationsOutline className="h-[22px] w-[22px] text-primary" />
          }
        />
        {notificationCount > 0 ? (
          <Badge
            className="absolute right-[34px] top-1"
            tone="danger"
            size="xs"
          >
            {notificationCount > 9 ? "9+" : String(notificationCount)}
          </Badge>
        ) : null}
        <IconButton
          aria-label="Soporte"
          onClick={onSupportPress}
          variant="ghost"
          size="sm"
          icon={<IoHeadsetOutline className="h-[22px] w-[22px] text-primary" />}
        />
      </div>
    </header>
  );
}
