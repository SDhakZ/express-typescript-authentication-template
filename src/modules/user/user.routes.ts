import { Router } from "express";
import * as UserController from "./user.controller";
import { authorize } from "../../middleware/authorize.middleware";
import { authenticate } from "../../middleware/authenticate.middleware";

const router = Router();

router.get("/profile", authenticate, UserController.getUserProfile);
router.get(
  "/listAllUsers",
  authenticate,
  authorize(["ADMIN"]),
  UserController.listAllUsers
);
router.patch("/profile", authenticate, UserController.updateProfile);
router.patch(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  UserController.adminUpdateUser
);

export default router;
