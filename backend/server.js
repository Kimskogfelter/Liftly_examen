import express from 'express';
import connect from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import multer from 'multer';

// skapa express server
const server = express();

// Läs från miljövariabler
const port = process.env.PORT || 3000;
const mongo_uri = process.env.MONGO_URI;

// middleware funktioner
server.use(express.urlencoded({extended: true}))
server.use(express.json({extended: true}))
server.use(cors({credentials: true, origin: ["http://localhost:5173"]}))
// koppla ihop multer med cloudinary senare för storage av bilder/vidoes
// server.use(multer())

// starta servern efter att DB är ansluten
connect(mongo_uri).then(server.listen(port, () => console.log(`Server started on port ${port}`)))
