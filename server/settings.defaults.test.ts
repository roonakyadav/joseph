import { describe, expect, it } from "vitest";
import { defaultStoreSettings, withDefaultStoreSettings } from "./db";

describe("Elite Traders store settings defaults", () => {
  it("returns a defined public-safe settings model when the singleton row does not exist", () => {
    expect(withDefaultStoreSettings(undefined)).toEqual(defaultStoreSettings);
    expect(defaultStoreSettings.storeName).toBe("Elite Traders");
  });

  it("preserves a persisted settings row instead of overwriting configured contact values", () => {
    const persisted = {
      id: 1,
      storeName: "Elite Traders India",
      whatsappNumber: "919999999999",
      whatsappCommunityUrl: "https://chat.whatsapp.com/example",
      defaultCurrency: "INR",
      createdAt: new Date("2026-08-15T00:00:00.000Z"),
      updatedAt: new Date("2026-08-15T00:00:00.000Z"),
    };

    expect(withDefaultStoreSettings(persisted)).toBe(persisted);
  });
});
