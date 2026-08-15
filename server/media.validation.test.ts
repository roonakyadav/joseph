import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./storage", () => ({ storagePut: vi.fn() }));

import { storeValidatedImage } from "./media";
import { storagePut } from "./storage";

const mockedStoragePut = vi.mocked(storagePut);

describe("controlled APEX image storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a non-image declaration before storage is invoked", async () => {
    await expect(storeValidatedImage("accounts/acct_test", {
      dataUrl: "data:application/pdf;base64,JVBERi0xLjQ=",
      mimeType: "application/pdf",
      name: "unsafe.pdf",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(mockedStoragePut).not.toHaveBeenCalled();
  });

  it("rejects a payload whose data URL does not match the declared image type before storage is invoked", async () => {
    await expect(storeValidatedImage("proofs/proof_test", {
      dataUrl: "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB",
      mimeType: "image/png",
      name: "mismatch.png",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(mockedStoragePut).not.toHaveBeenCalled();
  });

  it("rejects a signed image below the minimum dimensions before storage is invoked", async () => {
    await expect(storeValidatedImage("accounts/acct_test", {
      dataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
      mimeType: "image/png",
      name: "too-small.png",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(mockedStoragePut).not.toHaveBeenCalled();
  });
});
