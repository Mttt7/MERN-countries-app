import { ReviewResponseDto } from "../dto/review.response.dto";
import Review, { IReview } from "../models/Review";
import { IUser } from "../models/User";
import { UserService } from "./user.service";

export class ReviewService {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  createReview(user: IUser, review: IReview): Promise<IReview> {
    const newReview = new Review(review);
    newReview.userId = user.id;
    return newReview.save();
  }

  getReviewById(reviewId: string) {
    return Review.findById(reviewId).exec();
  }

  deleteReview(reviewId: string) {
    return Review.findByIdAndDelete(reviewId).exec();
  }

  editReview(reviewId: string, body: any) {
    return Review.findByIdAndUpdate(reviewId, body, { new: true }).exec();
  }

  async getReviewsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ reviews: ReviewResponseDto[]; isLastPage: boolean }> {
    const skip = (page - 1) * limit;
    let reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .exec(); // Fetch one extra item to check for last page

    const isLastPage = reviews.length <= limit; // If we have less or equal items than the limit, it's the last page
    if (!isLastPage) {
      reviews.pop(); // Remove the extra item if it's not the last page
    }

    const reviewsRes = await Promise.all(
      reviews.map(async (review) => {
        const user = await this.userService.getUserProfileById(review.userId);
        const reviewDto: ReviewResponseDto = {
          id: review._id.toString(),
          googleMapsUrl: review.googleMapsUrl,
          userId: review.userId,
          username: user?.username || "",
          rating: review.rating,
          comment: review.comment,
          photoUrl: review.photoUrl,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          title: review.title,
          city: review.city,
          likes: review.likes,
        };
        return reviewDto;
      })
    );

    return { reviews: reviewsRes, isLastPage };
  }

  async getAllReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<{ reviews: ReviewResponseDto[]; isLastPage: boolean }> {
    const skip = (page - 1) * limit;
    let reviews = await Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .exec(); // Fetch one extra item to check for last page

    const isLastPage = reviews.length <= limit; // Check if it's the last page
    if (!isLastPage) {
      reviews.pop(); // Remove the extra item if it's not the last page
    }

    const reviewsRes = await Promise.all(
      reviews.map(async (review) => {
        const user = await this.userService.getUserProfileById(review.userId);
        const reviewDto: ReviewResponseDto = {
          id: review._id.toString(),
          googleMapsUrl: review.googleMapsUrl,
          userId: review.userId,
          username: user?.username || "",
          rating: review.rating,
          comment: review.comment,
          photoUrl: review.photoUrl,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          title: review.title,
          city: review.city,
          likes: review.likes,
        };
        return reviewDto;
      })
    );

    return { reviews: reviewsRes, isLastPage };
  }
}
