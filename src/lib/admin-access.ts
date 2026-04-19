"use client";

/**
 * Tiny gate used to hide Deuna Negocios (the admin-side UI) from
 * regular shoppers. Not a real auth system — the MVP relies on a
 * shared, out-of-band code that the shopkeeper types (or scans via
 * QR) to unlock the console. The unlock flag lives in localStorage so
 * it survives page reloads, and can be wiped by the shopkeeper with
 * `lockAdmin()` from a "Cerrar sesión" button.
 */

export const ADMIN_ACCESS_STORAGE_KEY = "deuna-negocios-admin-unlocked";

/** Shared demo code. Override with `NEXT_PUBLIC_ADMIN_CODE` in prod. */
export const ADMIN_ACCESS_CODE =
  process.env.NEXT_PUBLIC_ADMIN_CODE ?? "2026";

/** Payload encoded inside the QR. Kept distinct from the bare code so
 *  we could later embed a signed URL or session token without breaking
 *  the manual-entry flow. */
export const ADMIN_QR_PAYLOAD = `deuna-negocios://login?code=${ADMIN_ACCESS_CODE}`;

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners(): void {
  listeners.forEach((l) => l());
}

export function isAdminUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ADMIN_ACCESS_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function unlockAdmin(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ADMIN_ACCESS_STORAGE_KEY, "1");
  } catch {
    /* quota / private mode — fail open so the UI doesn't get stuck */
  }
  notifyListeners();
}

export function lockAdmin(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ADMIN_ACCESS_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  notifyListeners();
}

/**
 * Subscribe helper for `useSyncExternalStore`. Tracks both in-tab
 * mutations (via our own listener set) and cross-tab mutations (via
 * the native `storage` event) so the gate reacts instantly no matter
 * how the flag changes.
 */
export function subscribeAdminAccess(listener: Listener): () => void {
  listeners.add(listener);

  const onStorage = (e: StorageEvent) => {
    if (e.key === ADMIN_ACCESS_STORAGE_KEY || e.key === null) listener();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/**
 * Case/whitespace-tolerant comparison. Mobile keyboards sometimes add
 * trailing spaces; upper/lower is ignored so the shopkeeper doesn't
 * fumble a typo on a 4-character string.
 */
export function matchesAdminCode(input: string): boolean {
  return input.trim().toLowerCase() === ADMIN_ACCESS_CODE.trim().toLowerCase();
}
