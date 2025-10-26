import * as AuthController from "./auth.controller";
import { Router } from "express";
import { loginlimiter, registerlimiter } from "../../middleware/ratelimiters";

const router = Router();
router.post("/register", registerlimiter, AuthController.register);
router.post("/login", loginlimiter, AuthController.login);

export default router;
