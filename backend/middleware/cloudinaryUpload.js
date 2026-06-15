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
      const publicId = `${file.fieldname}-${Date.now()}`;
      
      // check if uploading file is video
      const isVideo = file.mimetype.startsWith("video/");

      return {
        folder: folderPath,
        public_id: publicId,
        // resource_type: "auto" gör att Cloudinary automatiskt fattar om det är video eller bild
        resource_type: "auto", 
        // ONLY optimaze if the file is a image
        ...(!isVideo && {
          format: "webp",
          transformation: [
            {
              width: 1920, 
              crop: "limit",
              quality: "auto:good",
              fetch_format: "auto"
            }
          ]
        })
      };
    },
  });

  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      
      const allowedMimeTypes = [
        "image/jpeg", "image/png", "image/jpg", "image/webp", "image/heic", "image/heif",
        "video/mp4", "video/mpeg", "video/quicktime", "video/x-matroska" // .mp4, .mpeg, .mov, .mkv
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only image and video files are allowed", 400), false);
      }
    },
    limits: {
      
      fileSize: 50 * 1024 * 1024, 
    },
  });
}

export const upload = uploadFile("uploads");