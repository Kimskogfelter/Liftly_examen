// importera mongoose
import mongoose from "mongoose";

// Laddar .env automatiskt
import 'dotenv/config';  

const mongo_uri = process.env.MONGO_URI;

const connectToDB = async () => {

    try {

        await mongoose.connect(mongo_uri);
        console.log("MongoDB connected!");
    } catch (err) {
        console.log("Connection to DB failed", err);
    }
}

// exportera funktionen ovan så den kan användas i andra filer
export default connectToDB;