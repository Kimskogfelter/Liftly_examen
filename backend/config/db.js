// importera mongoose
import mongoose from "mongoose";

// Laddar .env automatiskt
import 'dotenv/config';  

const mongo_uri = process.env.MONGO_URI;

 export const connectToDB = async () => {

    try {

        await mongoose.connect(mongo_uri);
        console.log("MongoDB connected!");
    } catch (err) {
        console.log("Connection to DB failed", err);
    }
}