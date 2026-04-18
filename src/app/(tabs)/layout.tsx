import { AppBottomNav } from "@/components/deuna";

/**
 * Shell shared by every tabbed route. Today only `/` (Inicio) is
 * implemented — the bottom nav renders all three entries for visual
 * parity with the reference design, but `Mi Caja` and `Menú` route back
 * to `/` until those screens are built.
 */
export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <main className="flex-1 pb-20">{children}</main>
      <AppBottomNav active="inicio" />
    </div>
  );
}
