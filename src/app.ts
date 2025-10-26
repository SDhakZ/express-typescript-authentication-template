// src/app.ts
import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";

// import routes

const app = express();

// --- 1. Global middleware ---
app.use(cors({ origin: ENV.CORS_ORIGIN }));
app.use(express.json());

// --- 2. Health check route ---
app.get("/", (_req, res) =>
  res.json({ ok: true, message: "Server is running" })
);
// --- 3. Mount feature routes ---
app.use("/api/v1/auth", authRoutes);
// --- 3. Mount feature routes ---
app.use("/api/v1/auth", authRoutes);
// catch-all 404 (move after all feature routes so they can be reached)
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
// --- 4. Global error handler ---
app.use(errorHandler);

export default app;
