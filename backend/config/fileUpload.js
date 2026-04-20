import multer from 'multer';

// use memorystorage() to save files in RAM(for cloudinary storage)
const storage = multer.memoryStorage();
// use multer to show where to save files
export const uploadFile = multer({storage:storage});