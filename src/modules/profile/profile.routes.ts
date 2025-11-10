import * as ProfileController from "./profile.controller";
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";

const router = Router();

router.use(authenticate);

router.get("/", ProfileController.getUserProfile);
router.patch("/", ProfileController.updateProfile);
router.post("/change-password", ProfileController.changePasswordHandler);
export default router;
