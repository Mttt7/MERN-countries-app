import { Router } from "express";
import userController, { UserController } from "../controllers/user.controller";
import reviewController from "../controllers/review.controller";

const router = Router();

router.get("/:userId", userController.getUserProfileById);
router.post("/new/review", reviewController.createReview);
router.post("/:reviewId", userController.likeReview);

export default router;
