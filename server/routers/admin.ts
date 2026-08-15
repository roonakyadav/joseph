import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createAccount,
  createAccountMedia,
  createProof,
  getAdminAccountById,
  getAdminDashboardStats,
  getAccountMediaById,
  getAdminProofById,
  getAdminSubmissionById,
  getStoreSettings,
  linkSubmissionToAccount,
  listAdminAccounts,
  listAdminProofs,
  listAdminSubmissions,
  removeAccountMedia,
  updateAccount,
  updateAccountMedia,
  updateProof,
  updateSubmissionStatus,
  upsertStoreSettings,
} from "../db";
import { storeValidatedImage } from "../media";
import { adminProcedure, router } from "../_core/trpc";

const idInput = z.object({ id: z.string().trim().min(5).max(64) });
const slug = z.string().trim().min(3).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens.");
const quantity = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const imageUploadInput = z.object({
  dataUrl: z.string().min(32).max(7_100_000),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  name: z.string().trim().min(1).max(120),
  alt: z.string().trim().min(3).max(255),
});

const accountFields = z.object({
  slug,
  title: z.string().trim().min(2).max(160),
  ovr: z.number().int().min(1).max(200),
  price: z.number().int().min(0).max(1_000_000),
  currency: z.string().trim().min(3).max(8).default("USD"),
  status: z.enum(["available", "sold"]).default("available"),
  lifecycle: z.enum(["draft", "published", "archived"]).default("draft"),
  coins: quantity.default(0),
  gems: z.number().int().min(0).max(10_000_000).default(0),
  fcPoints: z.number().int().min(0).max(10_000_000).default(0),
  rank: z.string().trim().min(2).max(48),
  formation: z.string().trim().max(32).nullable().optional(),
  keyPlayers: z.array(z.string().trim().min(1).max(80)).min(1).max(24),
  description: z.string().trim().min(10).max(5000),
  featured: z.boolean().default(false),
  sellerWhatsapp: z.string().trim().max(64).nullable().optional(),
});

function accountCreateValues(input: z.infer<typeof accountFields>) {
  const now = new Date();
  return {
    ...input,
    formation: input.formation || null,
    sellerWhatsapp: input.sellerWhatsapp || null,
    publishedAt: input.lifecycle === "published" ? now : null,
    soldAt: input.status === "sold" ? now : null,
  };
}

function accountUpdateValues(existing: Awaited<ReturnType<typeof requireAccount>>, input: z.infer<typeof accountFields>) {
  const now = new Date();
  return {
    ...input,
    formation: input.formation || null,
    sellerWhatsapp: input.sellerWhatsapp || null,
    // Publication/sale timestamps represent first entry into each current state; edits must not rewrite history.
    publishedAt: existing.publishedAt ?? (input.lifecycle === "published" ? now : null),
    soldAt: input.status === "sold" ? (existing.soldAt ?? now) : null,
  };
}

const whatsappCommunityUrl = z.string().trim().url().max(512).refine(value => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "chat.whatsapp.com" || url.hostname.endsWith(".whatsapp.com"));
  } catch {
    return false;
  }
}, "Use a secure WhatsApp community URL.");

async function requireAccount(id: string) {
  const record = await getAdminAccountById(id);
  if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Account record not found." });
  return record;
}

async function requireProof(id: string) {
  const record = await getAdminProofById(id);
  if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Proof record not found." });
  return record;
}

export const adminRouter = router({
  dashboard: adminProcedure.query(() => getAdminDashboardStats()),
  accounts: router({
    list: adminProcedure.query(() => listAdminAccounts()),
    getById: adminProcedure.input(idInput).query(({ input }) => getAdminAccountById(input.id)),
    create: adminProcedure.input(accountFields).mutation(async ({ input }) => {
      const id = `acct_${randomUUID()}`;
      return createAccount({ id, ...accountCreateValues(input) });
    }),
    update: adminProcedure.input(idInput.extend({ data: accountFields.partial() })).mutation(async ({ input }) => {
      const existing = await requireAccount(input.id);
      const merged = accountFields.parse({ ...existing, ...input.data });
      return updateAccount(input.id, accountUpdateValues(existing, merged));
    }),
    publish: adminProcedure.input(idInput).mutation(async ({ input }) => {
      const account = await requireAccount(input.id);
      if (!account.media.some(media => media.isPrimary)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Set a primary account image before publishing this record." });
      }
      return updateAccount(input.id, { lifecycle: "published", publishedAt: account.publishedAt ?? new Date() });
    }),
    archive: adminProcedure.input(idInput).mutation(async ({ input }) => {
      await requireAccount(input.id);
      return updateAccount(input.id, { lifecycle: "archived", featured: false });
    }),
    setStatus: adminProcedure.input(idInput.extend({ status: z.enum(["available", "sold"]) })).mutation(async ({ input }) => {
      const account = await requireAccount(input.id);
      return updateAccount(input.id, { status: input.status, soldAt: input.status === "sold" ? (account.soldAt ?? new Date()) : null });
    }),
    setFeatured: adminProcedure.input(idInput.extend({ featured: z.boolean() })).mutation(async ({ input }) => {
      const existing = await requireAccount(input.id);
      if (input.featured && existing.lifecycle !== "published") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Only published accounts can be featured." });
      }
      return updateAccount(input.id, { featured: input.featured });
    }),
    addMedia: adminProcedure.input(idInput.extend({ image: imageUploadInput, isPrimary: z.boolean().default(false), sortOrder: z.number().int().min(0).max(200).default(0) })).mutation(async ({ input }) => {
      await requireAccount(input.id);
      const stored = await storeValidatedImage(`accounts/${input.id}`, input.image);
      if (input.isPrimary) {
        const existing = await getAdminAccountById(input.id);
        await Promise.all(existing?.media.map(media => updateAccountMedia(media.id, { isPrimary: false })) ?? []);
      }
      const media = {
        id: `media_${randomUUID()}`,
        accountId: input.id,
        url: stored.url,
        fileKey: stored.key,
        isPrimary: input.isPrimary,
        sortOrder: input.sortOrder,
        alt: input.image.alt,
      };
      await createAccountMedia(media);
      return media;
    }),
    updateMedia: adminProcedure.input(z.object({ id: z.string().trim().min(5).max(64), alt: z.string().trim().min(3).max(255).optional(), isPrimary: z.boolean().optional(), sortOrder: z.number().int().min(0).max(200).optional() })).mutation(async ({ input }) => {
      const { id, ...values } = input;
      const media = await getAccountMediaById(id);
      if (!media) throw new TRPCError({ code: "NOT_FOUND", message: "Account image not found." });
      await requireAccount(media.accountId);
      await updateAccountMedia(id, values);
      return { success: true };
    }),
    setPrimaryMedia: adminProcedure.input(z.object({ accountId: z.string().trim().min(5).max(64), mediaId: z.string().trim().min(5).max(64) })).mutation(async ({ input }) => {
      const account = await requireAccount(input.accountId);
      if (!account.media.some(media => media.id === input.mediaId)) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Image does not belong to this account." });
      }
      await Promise.all(account.media.map(media => updateAccountMedia(media.id, { isPrimary: media.id === input.mediaId })));
      return getAdminAccountById(input.accountId);
    }),
    removeMedia: adminProcedure.input(idInput).mutation(async ({ input }) => {
      const media = await getAccountMediaById(input.id);
      if (!media) throw new TRPCError({ code: "NOT_FOUND", message: "Account image not found." });
      await requireAccount(media.accountId);
      await removeAccountMedia(input.id);
      return { success: true };
    }),
  }),
  submissions: router({
    list: adminProcedure.query(() => listAdminSubmissions()),
    getById: adminProcedure.input(idInput).query(({ input }) => getAdminSubmissionById(input.id)),
    setStatus: adminProcedure.input(idInput.extend({ status: z.enum(["pending", "reviewing", "changes-requested", "approved", "rejected"]) })).mutation(async ({ input }) => {
      const existing = await getAdminSubmissionById(input.id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found." });
      return updateSubmissionStatus(input.id, input.status);
    }),
    convertToAccount: adminProcedure.input(z.object({ submissionId: z.string().trim().min(5).max(64), account: accountFields })).mutation(async ({ input }) => {
      const submission = await getAdminSubmissionById(input.submissionId);
      if (!submission) throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found." });
      if (submission.convertedAccountId) throw new TRPCError({ code: "CONFLICT", message: "This submission has already been converted." });
      if (submission.status !== "approved") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Approve the seller submission before preparing an account draft." });
      }
      const id = `acct_${randomUUID()}`;
      if (input.account.lifecycle !== "draft") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Converted submissions are prepared as drafts and must pass normal media review before publication." });
      }
      const account = await createAccount({ id, ...accountCreateValues({ ...input.account, lifecycle: "draft", featured: false }) });
      await linkSubmissionToAccount(input.submissionId, id);
      return account;
    }),
  }),
  proofs: router({
    list: adminProcedure.query(() => listAdminProofs()),
    create: adminProcedure.input(z.object({ accountId: z.string().trim().min(5).max(64).nullable().optional(), ovr: z.number().int().min(1).max(200).nullable().optional(), image: imageUploadInput, kind: z.enum(["handover", "account-record", "confirmation"]), caption: z.string().trim().max(2000).nullable().optional(), isDevelopment: z.boolean().default(false) })).mutation(async ({ input }) => {
      if (input.accountId) await requireAccount(input.accountId);
      const id = `proof_${randomUUID()}`;
      const stored = await storeValidatedImage(`proofs/${id}`, input.image);
      return createProof({ id, accountId: input.accountId ?? null, ovr: input.ovr ?? null, imageUrl: stored.url, fileKey: stored.key, imageAlt: input.image.alt, kind: input.kind, caption: input.caption ?? null, isDevelopment: input.isDevelopment, isPublished: false, lifecycle: "draft" });
    }),
    update: adminProcedure.input(z.object({ id: z.string().trim().min(5).max(64), accountId: z.string().trim().min(5).max(64).nullable().optional(), ovr: z.number().int().min(1).max(200).nullable().optional(), imageAlt: z.string().trim().min(3).max(255).optional(), kind: z.enum(["handover", "account-record", "confirmation"]).optional(), caption: z.string().trim().max(2000).nullable().optional(), isDevelopment: z.boolean().optional() })).mutation(async ({ input }) => {
      const existing = await requireProof(input.id);
      const { id, ...values } = input;
      if (values.accountId) await requireAccount(values.accountId);
      const isDevelopment = values.isDevelopment ?? existing.isDevelopment;
      if (isDevelopment) return updateProof(id, { ...values, isDevelopment: true, isPublished: false, lifecycle: "draft", publishedAt: null });
      return updateProof(id, values);
    }),
    publish: adminProcedure.input(idInput).mutation(async ({ input }) => {
      const proof = await requireProof(input.id);
      if (proof.isDevelopment) throw new TRPCError({ code: "BAD_REQUEST", message: "Development specimens can never be published." });
      return updateProof(input.id, { lifecycle: "published", isPublished: true, publishedAt: new Date() });
    }),
    archive: adminProcedure.input(idInput).mutation(async ({ input }) => {
      await requireProof(input.id);
      return updateProof(input.id, { lifecycle: "archived", isPublished: false });
    }),
  }),
  settings: router({
    get: adminProcedure.query(() => getStoreSettings()),
    update: adminProcedure.input(z.object({ storeName: z.string().trim().min(2).max(160), whatsappNumber: z.string().trim().max(64).nullable().optional(), whatsappCommunityUrl: whatsappCommunityUrl.nullable().optional(), defaultCurrency: z.string().trim().min(3).max(8) })).mutation(({ input }) => {
      return upsertStoreSettings({ ...input, whatsappNumber: input.whatsappNumber || null, whatsappCommunityUrl: input.whatsappCommunityUrl || null });
    }),
  }),
});
