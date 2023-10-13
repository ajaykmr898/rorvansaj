export * from "./alert.service";
export * from "./user.service";
export * from "./relations.service";

export const cloudConfig = () => {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  };
};
