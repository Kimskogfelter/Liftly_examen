import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryService } from '../config/cloudinaryConfig.js';

// middleware to upload files with Multer to Cloudinary
const uploadFile = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinaryService,
    params: (req, file) => {
      const folderPath = `${folderName.trim()}`; 
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;
      
      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
      };
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
  });
}

// create uploads folder in cloudinary
export const upload = uploadFile("uploads");