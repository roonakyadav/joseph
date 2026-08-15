export type ApexEvent =
  | "catalog_search"
  | "catalog_filter"
  | "catalog_sort"
  | "account_record_open"
  | "account_whatsapp_open"
  | "account_enquiry_copy"
  | "community_open"
  | "seller_submission_complete";

type EventPayload = Record<string, boolean | number | string>;

declare global {
  interface Window {
    umami?: { track?: (event: string, payload?: EventPayload) => void };
  }
}

/** Emits only product interaction metadata; never pass enquiry text, contact details, or uploaded-file names. */
export function trackApexEvent(event: ApexEvent, payload?: EventPayload) {
  if (typeof window === "undefined") return;
  window.umami?.track?.(event, payload);
}
