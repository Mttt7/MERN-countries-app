import { UserResponseDto } from "../dto/user.response.dto";
import Review, { IReview } from "../models/Review";
import User, { IUser } from "../models/User";

export class UserService {
  async getUserProfileById(userId: string): Promise<UserResponseDto | null> {
    try {
      const user = await User.findById(userId).exec();

      if (!user) {
        return null;
      }
      const userDto: UserResponseDto = {
        id: user.id.toString(),
        username: user.username,
      };

      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async likeReview(userId: string, reviewId: string) {
    try {
      let user = await User.findById(userId).exec();
      let review = await Review.findById(reviewId).exec();
      if (!user) {
        throw new Error("User not found.");
      }
      if (!review) {
        throw new Error("Review not found.");
      }

      if (user.likedReviews.includes(reviewId)) {
        user.likedReviews = user.likedReviews.filter((id) => id != reviewId);
        review.likes -= 1;
        user.save();
        await review.save();
      } else {
        user.likedReviews.push(reviewId);
        review.likes += 1;
        user.save();
        await review.save();
      }

      return { likes: review.likes };
    } catch (error) {
      throw error;
    }
  }
}
