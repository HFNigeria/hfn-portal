import contentUploadsApi from "@/api/contentUploadsApi.js";

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;
const MAX_EMBEDDED_CHARS = 1200000;

const dataUrlToBlob = (dataUrl) => {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);/)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
};

export const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const scale = Math.min(
          1,
          MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight)
        );
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        const draw = (background) => {
          if (background) {
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, width, height);
          }
          ctx.drawImage(img, 0, 0, width, height);
        };

        let dataUrl;
        if (file.type === "image/png") {
          draw();
          dataUrl = canvas.toDataURL("image/png");
        } else {
          draw("#ffffff");
          dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        }

        if (dataUrl.length > MAX_EMBEDDED_CHARS) {
          draw("#ffffff");
          dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        }

        resolve(dataUrl);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read the selected image"));
    };
    img.src = objectUrl;
  });

export const uploadPageImage = async (file) => {
  const dataUrl = await compressImage(file);

  try {
    const blob = dataUrlToBlob(dataUrl);
    const extension = blob.type === "image/png" ? "png" : "jpg";
    const form = new FormData();
    form.append("media_type", "image");
    form.append("title", (file.name || "page-image").replace(/\.[^.]+$/, ""));
    form.append("image", blob, `page-image.${extension}`);

    const res = await contentUploadsApi.createGalleryItem(form);
    const item = Array.isArray(res) ? res[0] : res;
    const hosted = item?.image || item?.url;
    if (!hosted || typeof hosted !== "string") {
      throw new Error("Upload response did not include an image URL");
    }
    return { url: hosted, hosted: true };
  } catch (e) {
    return { url: dataUrl, hosted: false, error: e };
  }
};
