import Image from "next/image";

import { cn } from "@/lib/cn";

export type BusinessMascotProps = {
  /** Path under `/public`. Defaults to the shipped Deuna mascot PNG. */
  src?: string;
  alt?: string;
  /** Square size in px. Defaults to 90. */
  size?: number;
  className?: string;
};

/**
 * Atom — Deuna Negocios mascot. Thin wrapper around `next/image`
 * pointing at `/assets/mascota.png` by default so campaign cards and
 * illustrations drop it in with zero config.
 */
export function BusinessMascot({
  src = "/assets/mascota.png",
  alt = "Mascota Deuna",
  size = 90,
  className,
}: BusinessMascotProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("object-contain", className)}
      priority={false}
    />
  );
}
