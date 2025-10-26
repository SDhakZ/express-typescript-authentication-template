// src/app.ts
import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import helmet from "helmet";
var compression = require("compression");
import morgan from "morgan";

const app = express();
// --- Global middleware ---
app.use(helmet());
app.use(compression());
app.use(cors({ origin: ENV.CORS_ORIGIN }));
app.use(express.json());

if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- API check route ---
app.get("/api/v1", (_req, res) =>
  res.json({ ok: true, message: "API is running" })
);

// --- Mount feature routes ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// --- Catch all invalid routes ---
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --- Global error handler ---
app.use(errorHandler);

export default app;
