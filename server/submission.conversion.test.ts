import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  createAccount: vi.fn(),
  getAdminSubmissionById: vi.fn(),
  linkSubmissionToAccount: vi.fn(),
}));

vi.mock("./db", () => ({
  createAccount: mocks.createAccount,
  getAdminSubmissionById: mocks.getAdminSubmissionById,
  linkSubmissionToAccount: mocks.linkSubmissionToAccount,
  createAccountMedia: vi.fn(),
  createProof: vi.fn(),
  getAdminAccountById: vi.fn(),
  getAdminDashboardStats: vi.fn(),
  getAdminProofById: vi.fn(),
  getStoreSettings: vi.fn(),
  listAdminAccounts: vi.fn(),
  listAdminProofs: vi.fn(),
  listAdminSubmissions: vi.fn(),
  removeAccountMedia: vi.fn(),
  updateAccount: vi.fn(),
  updateAccountMedia: vi.fn(),
  updateProof: vi.fn(),
  updateSubmissionStatus: vi.fn(),
  upsertStoreSettings: vi.fn(),
}));

vi.mock("./media", () => ({ storeValidatedImage: vi.fn() }));

import { adminRouter } from "./routers/admin";

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "apex-admin-test",
      email: "admin@example.com",
      name: "APEX Test Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const account = {
  slug: "approved-record",
  title: "Approved record",
  ovr: 120,
  price: 100,
  currency: "USD",
  status: "available" as const,
  lifecycle: "draft" as const,
  coins: 1_000_000,
  gems: 0,
  fcPoints: 0,
  rank: "Legend",
  formation: "4-3-3",
  keyPlayers: ["Example Player"],
  description: "A test-only account payload for protected lifecycle validation.",
  featured: false,
  sellerWhatsapp: null,
};

describe("APEX seller-submission conversion lifecycle", () => {
  beforeEach(() => vi.clearAllMocks());

  it("refuses to create a draft from a submission that has not been approved", async () => {
    mocks.getAdminSubmissionById.mockResolvedValue({ id: "sub_pending", status: "reviewing", convertedAccountId: null });
    const caller = adminRouter.createCaller(createAdminContext());

    await expect(caller.submissions.convertToAccount({ submissionId: "sub_pending", account })).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "Approve the seller submission before preparing an account draft.",
    });

    expect(mocks.createAccount).not.toHaveBeenCalled();
    expect(mocks.linkSubmissionToAccount).not.toHaveBeenCalled();
  });
});
