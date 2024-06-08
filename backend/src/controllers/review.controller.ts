// src/controllers/review.controller.ts
import { Request, Response } from "express";
import { IUser } from "../models/User";
import { IReview } from "../models/Review";
import { ReviewService } from "../services/review.service";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  public createReview = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const user: IUser = (req as any).user;
    const review: IReview = req.body;

    try {
      await this.reviewService.createReview(user, review);
      return res.json({ message: "Review created successfully." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  public getReviewsByUserId = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const userId: string = req.params.userId;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    try {
      const reviews = await this.reviewService.getReviewsByUserId(
        userId,
        page,
        limit
      );
      return res.json({ reviews, page, limit });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  public deleteReview = async (req: Request, res: Response) => {
    const reviewId = req.params.id;
    const user: IUser = (req as any).user;

    try {
      const review = await this.reviewService.getReviewById(reviewId);
      if (review === null) {
        return res.status(404).json({ error: "Review not found." });
      }
      if (review.userId.toString() !== user.id) {
        return res
          .status(401)
          .json({ error: "You are not authorized to delete this review." });
      }

      await this.reviewService.deleteReview(reviewId);
      return res.json({ message: "Review deleted successfully." });
    } catch (error: any) {
      console.error("Error deleting review:", error);
      return res.status(500).json({ error: error.message });
    }
  };

  public editReview = async (req: Request, res: Response) => {
    const reviewId = req.params.id;
    const user: IUser = (req as any).user;

    try {
      const review = await this.reviewService.getReviewById(reviewId);
      if (review === null) {
        return res.status(404).json({ error: "Review not found." });
      }
      if (review.userId.toString() !== user.id) {
        return res
          .status(401)
          .json({ error: "You are not authorized to edit this review." });
      }

      await this.reviewService.editReview(reviewId, req.body);
      return res.json({ message: "Review edited successfully." });
    } catch (error: any) {
      console.error("Error deleting review:", error);
      return res.status(500).json({ error: error.message });
    }
  };

  public getAllReviews = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    let isLastPage: boolean;

    try {
      const { reviews, isLastPage } = await this.reviewService.getAllReviews(
        page,
        limit
      );
      return res.json({ reviews, page, limit, isLastPage });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  public getReviewById = async (req: Request, res: Response) => {
    const reviewId = req.params.reviewId;
    console.log(reviewId);

    try {
      const review = await this.reviewService.getReviewById(reviewId);
      if (review === null) {
        return res.status(404).json({ error: "Review not found." });
      }
      return res.json(review);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}

export default new ReviewController();
