import mongoose from "mongoose";
// load .env file
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