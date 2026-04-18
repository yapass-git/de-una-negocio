/**
 * Types mirrored from `deuna-api/src/types.ts`. Duplicated on purpose
 * (MVP) — see the note in the backend file. If you change this file,
 * change the matching ones in `deuna-api` and `yapass-next` too.
 */

export type Location = {
  lat: number;
  lng: number;
};

export type CampaignType =
  | "vuelve-veci"
  | "refiera-una-vez"
  | "compre-3-veces"
  | "apure-veci"
  | "descuento-al-total";

export type Business = {
  id: string;
  name: string;
  ownerName: string;
  location: Location;
  barrio?: string;
};

export type Campaign = {
  id: string;
  businessId: string;
  business: Pick<Business, "id" | "name" | "location" | "barrio"> & {
    ownerName: string;
  };
  type: CampaignType;
  title: string;
  description: string;
  discountPct: number;
  investUSD: number;
  reachPeople: number;
  radiusM: number;
  createdAt: string;
  expiresAt: string;
};

export type UpsertBusinessInput = {
  id?: string;
  name: string;
  ownerName: string;
  location: Location;
  barrio?: string;
};

export type CreateCampaignInput = {
  businessId: string;
  type: CampaignType;
  radiusM?: number;
  /** Campaign lifetime in minutes. Defaults to 60 server-side. */
  durationMin?: number;
  /**
   * Per-request discount percentage override. When set, wins over the
   * catalogue default so the UI can launch arbitrary values (e.g. the
   * "OTRO" flow from the Netlife picker). 1–99.
   */
  discountPct?: number;
};
