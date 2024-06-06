import { UserResponseDto } from "../dto/user.response.dto";
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
}
