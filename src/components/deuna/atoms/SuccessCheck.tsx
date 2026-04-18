import { IoCheckmark } from "react-icons/io5";

import { cn } from "@/lib/cn";

export type SuccessCheckSize = "sm" | "md" | "lg";

const sizeMap: Record<SuccessCheckSize, { box: string; icon: string }> = {
  sm: { box: "h-8 w-8", icon: "h-[18px] w-[18px]" },
  md: { box: "h-12 w-12", icon: "h-[28px] w-[28px]" },
  lg: { box: "h-16 w-16", icon: "h-[36px] w-[36px]" },
};

export type SuccessCheckProps = {
  size?: SuccessCheckSize;
  className?: string;
};

/** Atom — filled green circle with a bold checkmark inside. Used as a
 *  non-verbal affordance ("it worked") at the top of success modals. */
export function SuccessCheck({ size = "md", className }: SuccessCheckProps) {
  const s = sizeMap[size];
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-accent-green text-white shadow-[var(--shadow-card)]",
        s.box,
        className,
      )}
    >
      <IoCheckmark className={cn("stroke-[36px]", s.icon)} />
    </div>
  );
}
