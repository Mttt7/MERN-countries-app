import { Router } from "express";
import reviewController from "../controllers/review.controller";

const router = Router();

router.post("/", reviewController.createReview);
router.get("/:userId", reviewController.getReviewsByUserId);

export default router;
