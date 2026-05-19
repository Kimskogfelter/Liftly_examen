import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryService } from '../config/cloudinaryConfig.js';
import { HttpError } from '../models/errorModel.js';

// middleware to upload files with Multer to Cloudinary
const uploadFile = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinaryService,
    params: (req, file) => {
      const folderPath = `${folderName.trim()}`;
      // const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;

      return {
        folder: folderPath,
        public_id: publicId,
        format: "webp",
        // added with help from Mattias Lager, teacher at Glimåkra folkhögskola
        transformation: [
          {
            width: 1920, 
            crop: "limit",
            quality: "auto:good",
            fetch_format: "auto"
        }
      ]
      };
    },
  });

  return multer({
    storage: storage,
    // ------------- written with help of chatGPT ------------------
    fileFilter: (req, file, cb) => {

      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/heic", "image/heif"] 

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed", 400), false);
      }
    },
    // -------------------------------------------------------------
    limits: {
      fileSize: 10 * 1024 * 1024, // keep images size < 10 MB
    },
  });
}

// create uploads folder in cloudinary
export const upload = uploadFile("uploads");