// src/app.ts
import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import adminRoutes from "./modules/admin/admin.routes";
import helmet from "helmet";
var compression = require("compression");
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();
// --- Global middleware ---
app.use(helmet());
app.use(compression());
app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- API check route ---
app.get("/api/v1", (_req, res) =>
  res.json({ ok: true, message: "API is running" })
);

// --- Mount feature routes ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// --- Catch all invalid routes ---
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Global error handler ---
app.use(errorHandler);

export default app;
