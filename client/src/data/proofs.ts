// APEX DESIGN: Sale Proofs — proof records remain source data; development specimens never imply completed customer transactions.
export type ProofKind = "handover" | "account-record" | "confirmation";
export type ProofAudience = "development" | "published";

export type ProofRecord = {
  id: string;
  accountId?: string;
  accountSlug?: string;
  ovr?: number;
  image: string;
  imageAlt: string;
  kind: ProofKind;
  caption?: string;
  isPublished: boolean;
  isDevelopment: boolean;
};

// Add authentic, permissioned proof records here only after their public images and metadata have been privacy reviewed.
export const publishedProofs: ProofRecord[] = [];

// These are interface specimens only: no person, payment, customer confirmation, date, amount, transaction reference or authentic handover is represented.
export const developmentProofs: ProofRecord[] = [
  {
    id: "#PF-DEV-001",
    accountId: "#FC-118-01",
    accountSlug: "fc-118-01",
    ovr: 118,
    image: "/manus-storage/apex-proof-dev-record_d8660da1.jpg",
    imageAlt: "Development-only example of a redacted APEX proof record layout; it contains no personal or transaction data.",
    kind: "account-record",
    caption: "Development specimen showing how a privacy-reviewed account record image could be presented.",
    isPublished: false,
    isDevelopment: true,
  },
  {
    id: "#PF-DEV-002",
    accountId: "#FC-116-02",
    accountSlug: "fc-116-02",
    ovr: 116,
    image: "/manus-storage/apex-proof-dev-handover_9ea8e2aa.jpg",
    imageAlt: "Development-only APEX handover archive illustration with redacted information; it contains no authentic conversation or payment data.",
    kind: "handover",
    caption: "Development specimen for a future handover-evidence format. It is not a completed sale record.",
    isPublished: false,
    isDevelopment: true,
  },
  {
    id: "#PF-DEV-003",
    accountId: "#FC-115-04",
    accountSlug: "fc-115-04",
    ovr: 115,
    image: "/manus-storage/apex-proof-dev-confirmation_669ab49a.jpg",
    imageAlt: "Development-only APEX confirmation archive illustration with no personal or payment information.",
    kind: "confirmation",
    caption: "Development specimen for an optional confirmation format. It is not customer evidence.",
    isPublished: false,
    isDevelopment: true,
  },
];

export let proofArchiveMode: ProofAudience = "development";

export const getVisibleProofs = () => proofArchiveMode === "published" ? publishedProofs.filter((proof) => proof.isPublished && !proof.isDevelopment) : developmentProofs;

export const proofKindLabel: Record<ProofKind, string> = {
  handover: "Handover format",
  "account-record": "Account record format",
  confirmation: "Confirmation format",
};
