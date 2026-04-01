import express from 'express';
import connect from 'mongoose';
import cors from 'cors';
import multer from 'multer';
// Ladda miljövariabler från .env
import 'dotenv/config';
// Funktion för att ansluta till MongoDB
import connectToDB from './config/db.js';
// Middleware för felhantering(error) och 404-rutter
import { errorHandler, notFoundEndpoint } from './middleware/errorMiddleware.js';

// skapa express server
const server = express();

// Läs från miljövariabler
const port = process.env.PORT || 3000;

// middleware funktioner
server.use(express.urlencoded({extended: true}))
server.use(express.json({extended: true}))
server.use(cors({credentials: true, origin: ["http://localhost:5173"]}))
server.use(notFoundEndpoint);
server.use(errorHandler);
// koppla ihop multer med cloudinary senare för storage av bilder/vidoes
// server.use(multer())

// ----------------------
// STARTA SERVERN
// ----------------------

// funktion för att starta servern efter att DB är ansluten
const startServer = async () => {
  try {
    // Vänta på att MongoDB är ansluten via funktionen connectToDB()
    await connectToDB();
    // Starta servern på angiven port
    server.listen(port, () => console.log(`Express server listening on port ${port}`));
  } catch (err) {
    // Logga fel om DB-anslutning misslyckas och stoppa servern
    console.error("Failed to connect to DB, server not started: ", err);
  }
};

// kör funktionen startServer()
startServer();
