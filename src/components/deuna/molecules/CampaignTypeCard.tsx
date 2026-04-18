"use client";

import { cn } from "@/lib/cn";
import { BusinessMascot } from "../atoms/BusinessMascot";
import { PercentPill } from "../atoms/PercentPill";

export type CampaignTypeCardProps = {
  id: string;
  title: string;
  description: string;
  /** Override the mascot PNG. Defaults to `/assets/mascota.png`. */
  mascotSrc?: string;
  /** Override the percent PNG. Defaults to `/assets/porcentaje.png`. */
  pillSrc?: string;
  /** Currently-selected id from the parent. Triggers the purple ring. */
  selected?: boolean;
  onSelect?: (id: string) => void;
};

/**
 * Molecule — one of the four campaign types on the "Lanza Tu Próxima
 * Campaña" screen. Composed from:
 *
 *   PercentPill    (atom — top-right % illustration)
 *   BusinessMascot (atom — right-aligned mascot illustration)
 *   title + description (text)
 *
 * Acts as a radio-style selector: tapping it fires `onSelect(id)`.
 */
export function CampaignTypeCard({
  id,
  title,
  description,
  mascotSrc,
  pillSrc,
  selected = false,
  onSelect,
}: CampaignTypeCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(id)}
      aria-pressed={selected}
      className={cn(
        "relative flex w-full items-stretch gap-3 overflow-hidden rounded-[var(--radius-lg)] bg-primary-soft px-4 py-4 text-left transition-all",
        "cursor-pointer active:scale-[0.99] hover:bg-primary-soft/80",
        selected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-[var(--shadow-card)]"
          : "ring-1 ring-transparent",
      )}
    >
      <div className="flex flex-1 flex-col justify-center gap-1 pr-20">
        <span className="text-title-sm text-primary">{title}</span>
        <span className="text-sm leading-[18px] text-ink/80">{description}</span>
      </div>

      <PercentPill
        src={pillSrc}
        size="md"
        className="absolute right-3 top-3"
      />

      <div className="flex items-end">
        <BusinessMascot src={mascotSrc} size={72} />
      </div>
    </button>
  );
}
