import { Router } from "express";
import reviewController from "../controllers/review.controller";

const router = Router();

router.get("/:userId", reviewController.getReviewsByUserId);
router.get("/", reviewController.getAllReviews);

export default router;
