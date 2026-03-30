import express from 'express';
import connect from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import multer from 'multer';

// skapa express server
const server = express();
// Läs port från miljövariabler, fallback till 3000
const port = process.env.PORT || 3000;

// middleware funktioner
server.use(express.urlencoded({extended: true}))
server.use(express.json({extended: true}))
server.use(cors({credentials: true, origin: ["http://localhost:5173"]}))
// koppla ihop multer med cloudinary senare för storage av bilder/vidoes
// server.use(multer())

// starta servern genom att lyssna
server.listen(port, () => console.log(`Server started on port ${port}`))