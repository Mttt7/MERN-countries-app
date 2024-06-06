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

  public getAllReviews = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    try {
      const reviews = await this.reviewService.getAllReviews(page, limit);
      return res.json({ reviews, page, limit });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}

export default new ReviewController();
