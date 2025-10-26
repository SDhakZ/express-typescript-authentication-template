// src/app.ts
import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";

// import routes


const app = express();

// --- 1. Global middleware ---
app.use(cors({ origin: ENV.CORS_ORIGIN }));
app.use(express.json());

// --- 2. Health check route ---
app.get("/", (_req, res) => res.json({ ok: true , message:"Server is running"}));

// --- 3. Mount feature routes ---

// --- 4. Global error handler ---
app.use(errorHandler);

export default app;
