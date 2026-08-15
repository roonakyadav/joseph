import {
  bigint,
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const accountStatuses = ["available", "sold"] as const;
export const accountLifecycles = ["draft", "published", "archived"] as const;
export const submissionStatuses = ["pending", "reviewing", "changes-requested", "approved", "rejected"] as const;
export const proofKinds = ["handover", "account-record", "confirmation"] as const;
export const proofLifecycles = ["draft", "published", "archived"] as const;

/** A listing is public only when its lifecycle is deliberately published. */
export const accounts = mysqlTable(
  "accounts",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 160 }).notNull(),
    ovr: int("ovr").notNull(),
    price: int("price").notNull(),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    status: mysqlEnum("status", accountStatuses).notNull().default("available"),
    lifecycle: mysqlEnum("lifecycle", accountLifecycles).notNull().default("draft"),
    coins: bigint("coins", { mode: "number" }).notNull().default(0),
    gems: int("gems").notNull().default(0),
    fcPoints: int("fcPoints").notNull().default(0),
    rank: varchar("rank", { length: 48 }).notNull(),
    formation: varchar("formation", { length: 32 }),
    keyPlayers: json("keyPlayers").$type<string[]>().notNull(),
    description: text("description").notNull(),
    featured: boolean("featured").notNull().default(false),
    sellerWhatsapp: varchar("sellerWhatsapp", { length: 64 }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
    publishedAt: timestamp("publishedAt"),
    soldAt: timestamp("soldAt"),
  },
  table => [
    index("accounts_public_index").on(table.lifecycle, table.status, table.featured),
    index("accounts_created_index").on(table.createdAt),
  ],
);

export const accountMedia = mysqlTable(
  "account_media",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    accountId: varchar("accountId", { length: 64 })
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    fileKey: varchar("fileKey", { length: 512 }).notNull(),
    isPrimary: boolean("isPrimary").notNull().default(false),
    sortOrder: int("sortOrder").notNull().default(0),
    alt: varchar("alt", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  table => [index("account_media_account_index").on(table.accountId, table.sortOrder)],
);

/** Seller intake stays private even when a listing is eventually created from it. */
export const sellerSubmissions = mysqlTable(
  "seller_submissions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    sellerName: varchar("sellerName", { length: 160 }).notNull(),
    contactMethod: varchar("contactMethod", { length: 32 }).notNull(),
    sellerContact: varchar("sellerContact", { length: 255 }).notNull(),
    accountTitle: varchar("accountTitle", { length: 160 }).notNull(),
    ovr: int("ovr").notNull(),
    priceExpectation: int("priceExpectation").notNull(),
    coins: bigint("coins", { mode: "number" }).notNull().default(0),
    gems: int("gems").notNull().default(0),
    fcPoints: int("fcPoints").notNull().default(0),
    rank: varchar("rank", { length: 48 }),
    formation: varchar("formation", { length: 32 }),
    keyPlayers: json("keyPlayers").$type<string[]>().notNull(),
    notes: text("notes"),
    status: mysqlEnum("status", submissionStatuses).notNull().default("pending"),
    convertedAccountId: varchar("convertedAccountId", { length: 64 }).references(() => accounts.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  },
  table => [
    index("seller_submissions_status_index").on(table.status, table.createdAt),
    index("seller_submissions_conversion_index").on(table.convertedAccountId),
  ],
);

/** Private seller evidence; original bytes remain in storage rather than MySQL. */
export const sellerSubmissionMedia = mysqlTable(
  "seller_submission_media",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    submissionId: varchar("submissionId", { length: 64 })
      .notNull()
      .references(() => sellerSubmissions.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    fileKey: varchar("fileKey", { length: 512 }).notNull(),
    sortOrder: int("sortOrder").notNull().default(0),
    alt: varchar("alt", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  table => [index("seller_submission_media_submission_index").on(table.submissionId, table.sortOrder)],
);

/** Development specimens are structurally ineligible for publication. */
export const saleProofs = mysqlTable(
  "sale_proofs",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    accountId: varchar("accountId", { length: 64 }).references(() => accounts.id, { onDelete: "set null" }),
    ovr: int("ovr"),
    imageUrl: text("imageUrl").notNull(),
    fileKey: varchar("fileKey", { length: 512 }).notNull(),
    imageAlt: varchar("imageAlt", { length: 255 }).notNull(),
    kind: mysqlEnum("kind", proofKinds).notNull(),
    caption: text("caption"),
    isDevelopment: boolean("isDevelopment").notNull().default(false),
    isPublished: boolean("isPublished").notNull().default(false),
    lifecycle: mysqlEnum("lifecycle", proofLifecycles).notNull().default("draft"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
    publishedAt: timestamp("publishedAt"),
  },
  table => [
    index("sale_proofs_public_index").on(table.lifecycle, table.isPublished, table.isDevelopment, table.createdAt),
    index("sale_proofs_account_index").on(table.accountId),
  ],
);

/** Singleton configuration containing only intentionally public contact values. */
export const storeSettings = mysqlTable("store_settings", {
  id: int("id").primaryKey(),
  storeName: varchar("storeName", { length: 160 }).notNull().default("APEX"),
  whatsappNumber: varchar("whatsappNumber", { length: 64 }),
  whatsappCommunityUrl: varchar("whatsappCommunityUrl", { length: 512 }),
  defaultCurrency: varchar("defaultCurrency", { length: 8 }).notNull().default("USD"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;
export type AccountMedia = typeof accountMedia.$inferSelect;
export type SellerSubmission = typeof sellerSubmissions.$inferSelect;
export type SellerSubmissionMedia = typeof sellerSubmissionMedia.$inferSelect;
export type SaleProof = typeof saleProofs.$inferSelect;
export type StoreSettings = typeof storeSettings.$inferSelect;
