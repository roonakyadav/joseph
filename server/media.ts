import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MIN_IMAGE_DIMENSION = 160;
const MAX_IMAGE_DIMENSION = 10_000;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export type ImageUpload = {
  dataUrl: string;
  mimeType: string;
  name: string;
};

function readImageDimensions(bytes: Buffer, mimeType: string) {
  if (mimeType === "image/png" && bytes.length >= 24) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }

  if (mimeType === "image/jpeg") {
    let cursor = 2;
    while (cursor + 9 < bytes.length) {
      if (bytes[cursor] !== 0xff) {
        cursor += 1;
        continue;
      }
      const marker = bytes[cursor + 1];
      const length = bytes.readUInt16BE(cursor + 2);
      if (length < 2 || cursor + length + 2 > bytes.length) break;
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          height: bytes.readUInt16BE(cursor + 5),
          width: bytes.readUInt16BE(cursor + 7),
        };
      }
      cursor += length + 2;
    }
  }

  if (mimeType === "image/webp" && bytes.length >= 30 && bytes.toString("ascii", 0, 4) === "RIFF") {
    const chunk = bytes.toString("ascii", 12, 16);
    if (chunk === "VP8X" && bytes.length >= 30) {
      return { width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3) };
    }
    if (chunk === "VP8 " && bytes.length >= 30) {
      return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === "VP8L" && bytes.length >= 25) {
      return {
        width: 1 + ((bytes[21] | (bytes[22] << 8)) & 0x3fff),
        height: 1 + (((bytes[22] >> 6) | (bytes[23] << 2) | (bytes[24] << 10)) & 0x3fff),
      };
    }
  }

  return null;
}

function assertImageSignature(bytes: Buffer, mimeType: string) {
  const valid =
    (mimeType === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (mimeType === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) ||
    (mimeType === "image/webp" && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP");

  if (!valid) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "The uploaded file does not match its declared image type." });
  }
}

function decodeDataUrl(upload: ImageUpload) {
  if (!acceptedImageTypes.has(upload.mimeType)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Use a PNG, JPEG, or WebP image." });
  }

  const match = upload.dataUrl.match(/^data:([^;]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match || match[1] !== upload.mimeType) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "The image upload payload is invalid." });
  }

  const base64 = match[2].replace(/\s/g, "");
  if (base64.length % 4 !== 0) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "The image encoding is invalid." });
  }

  const bytes = Buffer.from(base64, "base64");
  if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Images must be no larger than 5 MB." });
  }

  assertImageSignature(bytes, upload.mimeType);
  const dimensions = readImageDimensions(bytes, upload.mimeType);
  if (!dimensions || dimensions.width < MIN_IMAGE_DIMENSION || dimensions.height < MIN_IMAGE_DIMENSION || dimensions.width > MAX_IMAGE_DIMENSION || dimensions.height > MAX_IMAGE_DIMENSION) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Images must be between 160 px and 10,000 px in each dimension." });
  }

  return bytes;
}

export async function storeValidatedImage(folder: string, upload: ImageUpload) {
  const bytes = decodeDataUrl(upload);
  const extension = upload.mimeType === "image/png" ? "png" : upload.mimeType === "image/webp" ? "webp" : "jpg";
  const safeStem = upload.name.replace(/[^a-z0-9_-]/gi, "-").replace(/-+/g, "-").slice(0, 48) || "image";
  return storagePut(`${folder}/${safeStem}-${randomUUID()}.${extension}`, bytes, upload.mimeType);
}
