import { Router } from "express";
import reviewController from "../controllers/review.controller";

const router = Router();
router.delete("/:id", reviewController.deleteReview);
router.patch("/:id", reviewController.editReview);
router.get("/:reviewId", reviewController.getReviewById);

export default router;
