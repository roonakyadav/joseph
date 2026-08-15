import { describe, expect, it } from "vitest";

describe("managed application title", () => {
  it("is configured as Elite Traders", () => {
    expect(process.env.VITE_APP_TITLE).toBe("Elite Traders");
  });
});
