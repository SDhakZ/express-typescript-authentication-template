import 'dotenv/config';
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("4000"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid or missing environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const ENV = parsed.data;
