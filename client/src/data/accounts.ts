// APEX DESIGN: Shared customer-facing record contract. Live records are adapted
// from the protected database-backed public API; no development listings live here.
export type AccountStatus = "available" | "sold";

export type AccountMedia = {
  src: string;
  alt: string;
  label: "Record image";
};

export type AccountTransfer = {
  channel: string;
  note: string;
};

export type AccountRecord = {
  id: string;
  slug: string;
  title: string;
  ovr: number;
  price: number;
  currency: string;
  status: AccountStatus;
  image: string;
  imageAlt: string;
  media: AccountMedia[];
  coins: number;
  gems: number;
  fcPoints: number;
  rank: string;
  formation: string | null;
  keyPlayers: string[];
  description: string;
  createdAt: Date | string;
  featured: boolean;
  classification: "verified";
  transfer: AccountTransfer;
  sellerWhatsapp?: string;
};

type PublicAccountApiRecord = Omit<AccountRecord, "image" | "imageAlt" | "media" | "classification" | "transfer" | "id" | "sellerWhatsapp"> & {
  id: string;
  media: Array<{ url: string; alt: string; isPrimary: boolean; sortOrder: number }>;
  sellerWhatsapp: string | null;
};

export function mapPublicAccount(record: PublicAccountApiRecord): AccountRecord {
  const orderedMedia = [...record.media].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder);
  const primary = orderedMedia[0];
  const isSold = record.status === "sold";

  return {
    ...record,
    id: `#${record.id.slice(-8).toUpperCase()}`,
    image: primary?.url ?? "",
    imageAlt: primary?.alt ?? `${record.title} account record image`,
    media: orderedMedia.map(item => ({ src: item.url, alt: item.alt, label: "Record image" as const })),
    classification: "verified",
    sellerWhatsapp: record.sellerWhatsapp ?? undefined,
    transfer: isSold
      ? { channel: "Archive record", note: "This account has been marked sold and no seller contact action is available." }
      : record.sellerWhatsapp
        ? { channel: "WhatsApp", note: "Open the configured seller WhatsApp channel to confirm availability and handover terms." }
        : { channel: "Contact pending", note: "This verified record is available, but its direct seller contact path has not been configured yet." },
  };
}

export const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
};

export const formatQuantity = (amount: number) => {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return String(amount);
};
