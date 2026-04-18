import Image from "next/image";

import { cn } from "@/lib/cn";

export type PercentPillSize = "sm" | "md" | "lg";

export type PercentPillProps = {
  /** Path under `/public`. Defaults to the shipped `%` artwork. */
  src?: string;
  alt?: string;
  size?: PercentPillSize;
  className?: string;
};

const sizePxMap: Record<PercentPillSize, number> = {
  sm: 32,
  md: 44,
  lg: 56,
};

/**
 * Atom — circular "%" badge shown on Promociones cards. Used to be an
 * inline CSS circle; now renders the branded PNG
 * (`/assets/porcentaje.png`) so the discount symbol matches the rest
 * of the Deuna illustration set.
 */
export function PercentPill({
  src = "/assets/porcentaje.png",
  alt = "",
  size = "md",
  className,
}: PercentPillProps) {
  const px = sizePxMap[size];
  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      aria-hidden={alt === "" ? true : undefined}
      className={cn("object-contain", className)}
    />
  );
}
