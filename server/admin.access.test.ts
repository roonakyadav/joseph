import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createUserContext(role: "user" | "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: `test-${role}`,
      email: `${role}@example.com`,
      name: "APEX Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("APEX operations authorization", () => {
  it("rejects an authenticated standard user before any private dashboard data is read", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));

    await expect(caller.admin.dashboard()).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "You do not have required permission (10002)",
    });
  });

  it("rejects an unauthenticated caller from the private inventory router", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    await expect(caller.admin.accounts.list()).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "You do not have required permission (10002)",
    });
  });

  it("accepts the private request-changes lifecycle input before enforcing the admin boundary", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));

    await expect(caller.admin.submissions.setStatus({ id: "sub_test_request_changes", status: "changes-requested" })).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "You do not have required permission (10002)",
    });
  });

  it("rejects inventory creation and media upload before any database or storage side effect for a standard user", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));
    const account = {
      slug: "protected-mutation-test",
      title: "Protected mutation test",
      ovr: 100,
      price: 100,
      currency: "USD",
      status: "available" as const,
      lifecycle: "draft" as const,
      coins: 0,
      gems: 0,
      fcPoints: 0,
      rank: "Rank 1",
      formation: "4-3-3",
      keyPlayers: ["Test Player"],
      description: "A valid protected mutation payload used only to test authorization.",
      featured: false,
      sellerWhatsapp: null,
    };
    const image = {
      dataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB",
      mimeType: "image/png" as const,
      name: "protected.png",
      alt: "Protected mutation test image",
    };

    await expect(caller.admin.accounts.create(account)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.admin.accounts.addMedia({ id: "acct_test", image, isPrimary: true, sortOrder: 0 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
