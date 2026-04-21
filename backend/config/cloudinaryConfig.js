import {v2 as cloudinary} from "cloudinary";
import "dotenv/config";

cloudinary.config({
    cloud_name: process.env.LIFTLY_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.LIFTLY_CLOUDINARY_API_KEY,
    api_secret: process.env.LIFTLY_CLOUDINARY_API_SECRET,
})

// export kan ej ske direkt framför pga detta är ett funktionsanrop
// döper om funktionen till cloudinaryService
export {cloudinary as cloudinaryService};