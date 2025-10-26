import * as AuthController from "./auth.controller";
import { Router } from "express";
import rateLimit from "express-rate-limit";

const router = Router();

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    success: false,
    message:
      "Too many attempts from this IP, please try again after 10 minutes.",
    code: "TOO_MANY_ATTEMPTS",
  },
});

router.post("/register", rateLimiter, AuthController.register);
router.post("/login", rateLimiter, AuthController.login);

export default router;
