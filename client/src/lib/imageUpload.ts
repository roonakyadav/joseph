export type BrowserImageUpload = {
  dataUrl: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  name: string;
  alt: string;
};

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]) as ReadonlySet<string>;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export async function imageFileToUpload(file: File, alt: string): Promise<BrowserImageUpload> {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) throw new Error("Use a PNG, JPEG, or WebP image.");
  if (file.size > MAX_IMAGE_SIZE_BYTES) throw new Error("Images must be no larger than 5 MB.");

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });

  return { dataUrl, mimeType: file.type as BrowserImageUpload["mimeType"], name: file.name, alt };
}
