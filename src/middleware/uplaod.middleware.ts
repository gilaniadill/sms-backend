import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "students",
      format: file.mimetype.split("/")[1], // jpg/png
      public_id: "photo-" + Date.now()
    };
  }
});

export const uploadStudentphoto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});