import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  accountMedia,
  accounts,
  type InsertAccount,
  type InsertUser,
  saleProofs,
  sellerSubmissionMedia,
  sellerSubmissions,
  storeSettings,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  textFields.forEach(field => {
    const value = user[field];
    if (value === undefined) return;
    values[field] = value ?? null;
    updateSet[field] = value ?? null;
  });

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }

  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

async function attachAccountMedia<T extends { id: string }>(records: T[]) {
  if (records.length === 0) return records.map(record => ({ ...record, media: [] }));
  const db = await requireDb();
  const media = await db
    .select()
    .from(accountMedia)
    .where(inArray(accountMedia.accountId, records.map(record => record.id)))
    .orderBy(asc(accountMedia.sortOrder), asc(accountMedia.createdAt));

  const mediaByAccount = new Map<string, typeof media>();
  media.forEach(item => {
    const items = mediaByAccount.get(item.accountId) ?? [];
    items.push(item);
    mediaByAccount.set(item.accountId, items);
  });

  return records.map(record => ({ ...record, media: mediaByAccount.get(record.id) ?? [] }));
}

export async function listPublishedAccounts() {
  const db = await requireDb();
  const records = await db
    .select()
    .from(accounts)
    .where(eq(accounts.lifecycle, "published"))
    .orderBy(desc(accounts.featured), desc(accounts.createdAt));
  return attachAccountMedia(records);
}

export async function getPublishedAccountBySlug(slug: string) {
  const db = await requireDb();
  const records = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.slug, slug), eq(accounts.lifecycle, "published")))
    .limit(1);
  return (await attachAccountMedia(records))[0];
}

export async function listFeaturedAccounts(limit = 3) {
  const db = await requireDb();
  const records = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.lifecycle, "published"), eq(accounts.featured, true)))
    .orderBy(desc(accounts.createdAt))
    .limit(limit);
  return attachAccountMedia(records);
}

export async function listAdminAccounts() {
  const db = await requireDb();
  const records = await db.select().from(accounts).orderBy(desc(accounts.updatedAt));
  return attachAccountMedia(records);
}

export async function getAdminAccountById(id: string) {
  const db = await requireDb();
  const records = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
  return (await attachAccountMedia(records))[0];
}

export async function createAccount(values: InsertAccount) {
  const db = await requireDb();
  await db.insert(accounts).values(values);
  return getAdminAccountById(values.id);
}

export async function updateAccount(id: string, values: Partial<InsertAccount>) {
  const db = await requireDb();
  await db.update(accounts).set(values).where(eq(accounts.id, id));
  return getAdminAccountById(id);
}

export async function createAccountMedia(values: typeof accountMedia.$inferInsert) {
  const db = await requireDb();
  await db.insert(accountMedia).values(values);
  return values;
}

export async function getAccountMediaById(id: string) {
  const db = await requireDb();
  const records = await db.select().from(accountMedia).where(eq(accountMedia.id, id)).limit(1);
  return records[0];
}

export async function updateAccountMedia(
  id: string,
  values: Partial<Pick<typeof accountMedia.$inferInsert, "alt" | "isPrimary" | "sortOrder">>,
) {
  const db = await requireDb();
  await db.update(accountMedia).set(values).where(eq(accountMedia.id, id));
}

export async function removeAccountMedia(id: string) {
  const db = await requireDb();
  await db.delete(accountMedia).where(eq(accountMedia.id, id));
}

export async function listAdminSubmissions() {
  const db = await requireDb();
  return db.select().from(sellerSubmissions).orderBy(asc(sellerSubmissions.status), desc(sellerSubmissions.createdAt));
}

export async function getAdminSubmissionById(id: string) {
  const db = await requireDb();
  const records = await db.select().from(sellerSubmissions).where(eq(sellerSubmissions.id, id)).limit(1);
  const submission = records[0];
  if (!submission) return undefined;
  const media = await db
    .select()
    .from(sellerSubmissionMedia)
    .where(eq(sellerSubmissionMedia.submissionId, id))
    .orderBy(asc(sellerSubmissionMedia.sortOrder));
  return { ...submission, media };
}

export async function createSellerSubmission(
  values: typeof sellerSubmissions.$inferInsert,
  media: (typeof sellerSubmissionMedia.$inferInsert)[],
) {
  const db = await requireDb();
  await db.transaction(async tx => {
    await tx.insert(sellerSubmissions).values(values);
    if (media.length > 0) await tx.insert(sellerSubmissionMedia).values(media);
  });
  return getAdminSubmissionById(values.id);
}

export async function updateSubmissionStatus(
  id: string,
  status: typeof sellerSubmissions.$inferInsert.status,
) {
  const db = await requireDb();
  await db.update(sellerSubmissions).set({ status }).where(eq(sellerSubmissions.id, id));
  return getAdminSubmissionById(id);
}

export async function linkSubmissionToAccount(submissionId: string, accountId: string) {
  const db = await requireDb();
  await db
    .update(sellerSubmissions)
    .set({ status: "approved", convertedAccountId: accountId })
    .where(eq(sellerSubmissions.id, submissionId));
  return getAdminSubmissionById(submissionId);
}

export async function listAdminProofs() {
  const db = await requireDb();
  return db.select().from(saleProofs).orderBy(desc(saleProofs.updatedAt));
}

export async function listPublishedProofs() {
  const db = await requireDb();
  const records = await db
    .select({
      id: saleProofs.id,
      accountId: saleProofs.accountId,
      ovr: saleProofs.ovr,
      imageUrl: saleProofs.imageUrl,
      imageAlt: saleProofs.imageAlt,
      kind: saleProofs.kind,
      caption: saleProofs.caption,
      createdAt: saleProofs.createdAt,
      accountSlug: accounts.slug,
      accountLifecycle: accounts.lifecycle,
    })
    .from(saleProofs)
    .leftJoin(accounts, eq(saleProofs.accountId, accounts.id))
    .where(
      and(
        eq(saleProofs.lifecycle, "published"),
        eq(saleProofs.isPublished, true),
        eq(saleProofs.isDevelopment, false),
      ),
    )
    .orderBy(desc(saleProofs.publishedAt), desc(saleProofs.createdAt));

  return records.map(({ accountLifecycle, accountSlug, ...proof }) => ({
    ...proof,
    accountSlug: accountLifecycle === "published" ? accountSlug : null,
  }));
}

export async function getAdminProofById(id: string) {
  const db = await requireDb();
  const records = await db.select().from(saleProofs).where(eq(saleProofs.id, id)).limit(1);
  return records[0];
}

export async function createProof(values: typeof saleProofs.$inferInsert) {
  const db = await requireDb();
  await db.insert(saleProofs).values(values);
  return getAdminProofById(values.id);
}

export async function updateProof(id: string, values: Partial<typeof saleProofs.$inferInsert>) {
  const db = await requireDb();
  await db.update(saleProofs).set(values).where(eq(saleProofs.id, id));
  return getAdminProofById(id);
}

export async function getStoreSettings() {
  const db = await requireDb();
  const records = await db.select().from(storeSettings).where(eq(storeSettings.id, 1)).limit(1);
  return records[0];
}

export async function upsertStoreSettings(values: Omit<typeof storeSettings.$inferInsert, "id">) {
  const db = await requireDb();
  await db
    .insert(storeSettings)
    .values({ id: 1, ...values })
    .onDuplicateKeyUpdate({ set: values });
  return getStoreSettings();
}

export async function getAdminDashboardStats() {
  const db = await requireDb();
  const [accountStats, submissionStats, proofStats] = await Promise.all([
    db
      .select({
        total: count(),
        published: count(accounts.lifecycle),
      })
      .from(accounts),
    db
      .select({ total: count() })
      .from(sellerSubmissions)
      .where(inArray(sellerSubmissions.status, ["pending", "reviewing"])),
    db
      .select({ total: count() })
      .from(saleProofs)
      .where(and(eq(saleProofs.lifecycle, "draft"), eq(saleProofs.isDevelopment, false))),
  ]);

  const availability = await db
    .select({ status: accounts.status, total: count() })
    .from(accounts)
    .where(eq(accounts.lifecycle, "published"))
    .groupBy(accounts.status);

  return {
    accounts: accountStats[0]?.total ?? 0,
    openSubmissions: submissionStats[0]?.total ?? 0,
    draftProofs: proofStats[0]?.total ?? 0,
    available: availability.find(item => item.status === "available")?.total ?? 0,
    sold: availability.find(item => item.status === "sold")?.total ?? 0,
  };
}
