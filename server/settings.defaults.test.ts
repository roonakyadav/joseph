import { describe, expect, it } from "vitest";
import { defaultStoreSettings, withDefaultStoreSettings } from "./db";

describe("APEX store settings defaults", () => {
  it("returns a defined public-safe settings model when the singleton row does not exist", () => {
    expect(withDefaultStoreSettings(undefined)).toEqual(defaultStoreSettings);
  });

  it("preserves a persisted settings row instead of overwriting configured contact values", () => {
    const persisted = {
      id: 1,
      storeName: "APEX India",
      whatsappNumber: "919999999999",
      whatsappCommunityUrl: "https://chat.whatsapp.com/example",
      defaultCurrency: "INR",
      createdAt: new Date("2026-08-15T00:00:00.000Z"),
      updatedAt: new Date("2026-08-15T00:00:00.000Z"),
    };

    expect(withDefaultStoreSettings(persisted)).toBe(persisted);
  });
});
