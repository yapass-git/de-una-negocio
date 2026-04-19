"use client";

import { usePathname } from "next/navigation";

import { AdminAccessGate, AppBottomNav } from "@/components/deuna";

/**
 * Routes that take over the full viewport and therefore should NOT
 * render the bottom tab bar (e.g. the Desafío detail screens, which
 * have their own "Volver" button at the bottom). Match by exact path
 * or by `path/.*` prefix.
 */
const FULL_BLEED_PATHS: readonly string[] = ["/desafios/"];

function isFullBleed(pathname: string | null): boolean {
  if (!pathname) return false;
  return FULL_BLEED_PATHS.some((p) => pathname.startsWith(p));
}

/**
 * Shell shared by every tabbed route. Sits behind `AdminAccessGate`
 * so the admin console stays invisible (no tab bar, no pages) until
 * the shopkeeper scans the QR or types the access code. Renders the
 * page content with enough bottom padding to clear the fixed
 * `AppBottomNav`, except on full-bleed detail screens where the nav
 * is suppressed.
 */
export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const fullBleed = isFullBleed(pathname);

  return (
    <AdminAccessGate>
      <div className="relative flex min-h-screen flex-1 flex-col">
        <main className={fullBleed ? "flex-1" : "flex-1 pb-20"}>{children}</main>
        {fullBleed ? null : <AppBottomNav />}
      </div>
    </AdminAccessGate>
  );
}
