import { Router } from "express";
import userController, { UserController } from "../controllers/user.controller";

const router = Router();

router.get("/:userId", userController.getUserProfileById);

export default router;
