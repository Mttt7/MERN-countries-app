import Review, { IReview } from "../models/Review";
import { IUser } from "../models/User";

export class ReviewService {
  createReview(user: IUser, review: IReview): Promise<IReview> {
    const newReview = new Review(review);
    newReview.userId = user.id;
    return newReview.save();
  }

  getReviewsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IReview[]> {
    const skip = (page - 1) * limit;
    return Review.find({ userId }).skip(skip).limit(limit).exec();
  }

  getAllReviews(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return Review.find().skip(skip).limit(limit).exec();
  }
}
