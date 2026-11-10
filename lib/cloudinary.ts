import { v2 as cloudinary } from "cloudinary";

function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return cloudinary;
}

export async function uploadProductImage(file: File) {
  const client = cloudinaryConfig();
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      { folder: "zenlora/products", resource_type: "image" },
      (error, uploaded) => {
        if (error || !uploaded) {
          reject(error ?? new Error("Image upload failed"));
          return;
        }
        resolve(uploaded);
      },
    );

    stream.end(buffer);
  });

  return result.secure_url;
}
