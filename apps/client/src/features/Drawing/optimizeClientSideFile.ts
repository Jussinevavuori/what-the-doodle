export type ClientSideOptimizationOptions = {
  maxDim?: number;
  jpegQuality?: number;
};

/**
 * Utility to optimize images on the client using canvas API. Accepts Blob.
 */
export async function optimizeClientSideFile(
  blob: Blob,
  options: ClientSideOptimizationOptions = {},
): Promise<Blob> {
  const maxDim = options.maxDim || 1200;
  const jpegQuality = options.jpegQuality || 0.85;

  if (typeof window === "undefined") return blob;
  if (!blob.type.startsWith("image/")) return blob;
  if (blob.type === "image/svg+xml") return blob;

  try {
    const img = new Image();
    const reader = new FileReader();

    return await new Promise<Blob>((resolve, reject) => {
      reader.onload = () => {
        if (typeof reader.result !== "string") return reject(new Error("Invalid result"));
        img.src = reader.result;
      };

      img.onload = () => {
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Could not get canvas context"));

        ctx.drawImage(img, 0, 0, width, height);

        // Do not optimize transparent PNG images
        if (blob.type === "image/png") {
          const pixels = ctx.getImageData(0, 0, width, height).data;
          for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 255) return reject(new Error("PNG image has transparency"));
          }
        }

        canvas.toBlob(
          (resultBlob) => {
            if (resultBlob) resolve(resultBlob);
            else reject(new Error("Failed to convert to Blob"));
          },
          "image/jpeg",
          jpegQuality,
        );
      };

      img.onerror = reject;
      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error optimizing client-side file:", error);
    return blob;
  }
}
