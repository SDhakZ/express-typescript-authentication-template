import * as ProfileController from "./profile.controller";
import { Router, RequestHandler } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";
const router = Router();

router.use(authenticate as RequestHandler);

router.get("/", ProfileController.getUserProfile as RequestHandler);
router.patch("/", ProfileController.updateProfile as RequestHandler);
router.post(
  "/change-password",
  ProfileController.changePasswordHandler as RequestHandler
);
router.post(
  "/add-password",
  ProfileController.addPasswordHandler as RequestHandler
);
export default router;
