import { Router } from "express";
import * as AdminController from "./admin.controller";
import { authorize } from "../../middleware/authorize.middleware";
import { authenticate } from "../../middleware/authenticate.middleware";

const router = Router();

router.get(
  "/users/:id",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.getUserById
);
router.get(
  "/users",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.listAllUsers
);
router.patch(
  "/users/:id",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.adminUpdateUser
);

export default router;
