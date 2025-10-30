export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(",")[1] || "";
      resolve(base64data);
    };
    reader.onerror = () => {
      reject(new Error("Failed to convert blob to base64"));
    };
    reader.readAsDataURL(blob);
  });
}
