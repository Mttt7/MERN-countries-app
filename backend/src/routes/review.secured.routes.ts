import { Router } from "express";
import reviewController from "../controllers/review.controller";

const router = Router();
router.delete("/:id", reviewController.deleteReview);

export default router;
