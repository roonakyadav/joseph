// APEX DESIGN: Seller Intake — form data is structured for future review, but this static project never persists or publicly publishes a submission.
export type SellerContactMethod = "whatsapp" | "email" | "other";

export type SellerSubmissionDraft = {
  sellerName: string;
  contactMethod: SellerContactMethod;
  sellerContact: string;
  accountTitle: string;
  ovr: string;
  priceExpectation: string;
  coins: string;
  gems: string;
  fcPoints: string;
  rank: string;
  formation: string;
  keyPlayers: string;
  notes: string;
};

export type SellerSubmissionPayload = Omit<SellerSubmissionDraft, "ovr" | "priceExpectation" | "coins" | "gems" | "fcPoints"> & {
  ovr: number;
  priceExpectation?: number;
  coins?: number;
  gems?: number;
  fcPoints?: number;
  imageFiles: File[];
  createdAt: string;
};

export type SellerSubmissionStatus = "pending" | "reviewing" | "approved" | "rejected";

export type SellerSubmissionRecord = SellerSubmissionPayload & {
  id: string;
  status: SellerSubmissionStatus;
};

export const emptySellerSubmissionDraft: SellerSubmissionDraft = {
  sellerName: "", contactMethod: "whatsapp", sellerContact: "", accountTitle: "", ovr: "", priceExpectation: "", coins: "", gems: "", fcPoints: "", rank: "", formation: "", keyPlayers: "", notes: "",
};

export const APEX_SELLER_SUBMISSION_ENDPOINT = "";

export type SellerHandoffResult =
  | { kind: "accepted"; reference: string }
  | { kind: "not-configured"; message: string }
  | { kind: "failed"; message: string };

/**
 * The only production seam for seller intake. It has no localStorage fallback and does not pretend a submission was stored.
 * Connect this function to an authenticated server endpoint and secure file storage before enabling live seller handoff.
 */
export async function handoffSellerSubmission(_payload: SellerSubmissionPayload): Promise<SellerHandoffResult> {
  if (!APEX_SELLER_SUBMISSION_ENDPOINT) {
    return { kind: "not-configured", message: "Seller submissions are not connected yet. Your form stays on this device and has not been sent." };
  }
  return { kind: "failed", message: "The configured submission service could not be reached. Please try again later." };
}

export const sellerRequiredFields = ["sellerName", "sellerContact", "accountTitle", "ovr"] as const;
