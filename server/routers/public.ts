import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  createSellerSubmission,
  getPublishedAccountBySlug,
  getStoreSettings,
  listFeaturedAccounts,
  listPublishedAccounts,
  listPublishedProofs,
} from "../db";
import { storeValidatedImage } from "../media";
import { publicProcedure, router } from "../_core/trpc";

const imageUploadInput = z.object({
  dataUrl: z.string().min(32).max(7_100_000),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  name: z.string().trim().min(1).max(120),
  alt: z.string().trim().min(3).max(255),
});

const toPublicAccount = <T extends { media: { fileKey: string }[] }>(record: T) => ({
  ...record,
  media: record.media.map(({ fileKey: _fileKey, ...media }) => media),
});

export const accountsRouter = router({
    list: publicProcedure.query(async () => (await listPublishedAccounts()).map(toPublicAccount)),
    getBySlug: publicProcedure.input(z.object({ slug: z.string().trim().min(1).max(160) })).query(async ({ input }) => {
      const record = await getPublishedAccountBySlug(input.slug);
      return record ? toPublicAccount(record) : null;
    }),
    getFeatured: publicProcedure.input(z.object({ limit: z.number().int().min(1).max(6).default(3) }).optional()).query(async ({ input }) => {
      return (await listFeaturedAccounts(input?.limit ?? 3)).map(toPublicAccount);
    }),
});

export const proofsRouter = router({
  list: publicProcedure.query(() => listPublishedProofs()),
});

export const settingsRouter = router({
  getPublic: publicProcedure.query(async () => {
    const settings = await getStoreSettings();
    return settings ?? {
      storeName: "APEX",
      whatsappNumber: null,
      whatsappCommunityUrl: null,
      defaultCurrency: "USD",
    };
  }),
});

export const submissionsRouter = router({
    create: publicProcedure
      .input(
        z.object({
          sellerName: z.string().trim().min(2).max(160),
          contactMethod: z.string().trim().min(2).max(32),
          sellerContact: z.string().trim().min(3).max(255),
          accountTitle: z.string().trim().min(2).max(160),
          ovr: z.number().int().min(1).max(200),
          priceExpectation: z.number().int().min(0).max(1_000_000),
          coins: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
          gems: z.number().int().min(0).max(10_000_000),
          fcPoints: z.number().int().min(0).max(10_000_000),
          rank: z.string().trim().max(48).nullable().optional(),
          formation: z.string().trim().max(32).nullable().optional(),
          keyPlayers: z.array(z.string().trim().min(1).max(80)).max(24),
          notes: z.string().trim().max(5000).nullable().optional(),
          images: z.array(imageUploadInput).max(6),
        }),
      )
      .mutation(async ({ input }) => {
        const submissionId = `sub_${randomUUID()}`;
        const media = await Promise.all(
          input.images.map(async (image, sortOrder) => {
            const stored = await storeValidatedImage(`seller-submissions/${submissionId}`, image);
            return {
              id: `submed_${randomUUID()}`,
              submissionId,
              url: stored.url,
              fileKey: stored.key,
              sortOrder,
              alt: image.alt,
            };
          }),
        );

        await createSellerSubmission(
          {
            id: submissionId,
            sellerName: input.sellerName,
            contactMethod: input.contactMethod,
            sellerContact: input.sellerContact,
            accountTitle: input.accountTitle,
            ovr: input.ovr,
            priceExpectation: input.priceExpectation,
            coins: input.coins,
            gems: input.gems,
            fcPoints: input.fcPoints,
            rank: input.rank ?? null,
            formation: input.formation ?? null,
            keyPlayers: input.keyPlayers,
            notes: input.notes ?? null,
            status: "pending",
          },
          media,
        );

        return { id: submissionId, accepted: true };
      }),
});

export const storefrontRouter = router({
  accounts: accountsRouter,
  proofs: proofsRouter,
  settings: settingsRouter,
  submissions: submissionsRouter,
});
