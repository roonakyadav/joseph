// APEX DESIGN: Account Archive — development listings are structured product records, not presentation-specific card data.
export type AccountStatus = "available" | "sold";

export type AccountRecord = {
  id: string;
  slug: string;
  title: string;
  ovr: number;
  price: number;
  currency: "USD";
  status: AccountStatus;
  image: string;
  imageAlt: string;
  coins: number;
  gems: number;
  rank: "Gold" | "Elite" | "Legend";
  keyPlayers: string[];
  description: string;
  createdAt: string;
  featured: boolean;
  sellerWhatsapp?: string;
};

export const accountRecords: AccountRecord[] = [
  {
    id: "#FC-118-01",
    slug: "fc-118-01",
    title: "Catalyst XI",
    ovr: 118,
    price: 89,
    currency: "USD",
    status: "available",
    image: "/manus-storage/apex-account-catalyst_60a77997.jpg",
    imageAlt: "Development concept image for the Catalyst XI FC Mobile account",
    coins: 2400000000,
    gems: 18000,
    rank: "Legend",
    keyPlayers: ["Ronaldo", "Zidane", "Gullit"],
    description: "High-end attack core with a balanced midfield structure.",
    createdAt: "2026-08-15T08:00:00.000Z",
    featured: true,
  },
  {
    id: "#FC-116-02",
    slug: "fc-116-02",
    title: "Pressing Line",
    ovr: 116,
    price: 64,
    currency: "USD",
    status: "available",
    image: "/manus-storage/apex-account-pressing_87b546d2.jpg",
    imageAlt: "Development concept image for the Pressing Line FC Mobile account",
    coins: 1320000000,
    gems: 7600,
    rank: "Elite",
    keyPlayers: ["Mbappé", "Rodri", "Maldini"],
    description: "A fast press profile with depth across the defensive line.",
    createdAt: "2026-08-13T08:00:00.000Z",
    featured: false,
  },
  {
    id: "#FC-113-03",
    slug: "fc-113-03",
    title: "Counterweight",
    ovr: 113,
    price: 39,
    currency: "USD",
    status: "available",
    image: "/manus-storage/apex-account-counterweight_41bb4c5e.jpg",
    imageAlt: "Development concept image for the Counterweight FC Mobile account",
    coins: 680000000,
    gems: 3100,
    rank: "Gold",
    keyPlayers: ["Henry", "Modrić", "Rúben Dias"],
    description: "Value-forward squad with a mature control spine.",
    createdAt: "2026-08-10T08:00:00.000Z",
    featured: false,
  },
  {
    id: "#FC-115-04",
    slug: "fc-115-04",
    title: "Archive Eleven",
    ovr: 115,
    price: 54,
    currency: "USD",
    status: "sold",
    image: "/manus-storage/apex-account-archive_bb27ab65.jpg",
    imageAlt: "Development concept image for the Archive Eleven FC Mobile account",
    coins: 910000000,
    gems: 5200,
    rank: "Elite",
    keyPlayers: ["Pelé", "Xavi", "Cannavaro"],
    description: "An archived sold listing retained as a format reference.",
    createdAt: "2026-08-07T08:00:00.000Z",
    featured: false,
  },
];

export const formatCurrency = (amount: number, currency: AccountRecord["currency"]) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

export const formatQuantity = (amount: number) => {
  if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return String(amount);
};

export const getAccountBySlug = (slug: string) => accountRecords.find((account) => account.slug === slug);
