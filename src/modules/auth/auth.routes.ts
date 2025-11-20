import * as AuthController from "./auth.controller";
import { Router } from "express";
import { loginlimiter, registerlimiter } from "../../middleware/ratelimiters";
import passport from "./auth.passport";

const router = Router();
router.post("/register", registerlimiter, AuthController.register);
router.post("/login", loginlimiter, AuthController.login);
router.post("/refresh", AuthController.validateRefreshToken);
router.post("/logout", AuthController.logout);

// Google OAuth
router.get(
  "/google",
  // start OAuth flow
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  // no session; tokens handled by our app
  passport.authenticate("google", { session: false }),
  AuthController.googleOAuthCallback
);

export default router;
