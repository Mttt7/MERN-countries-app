import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  public getUserProfileById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const userId: string = req.params.userId;

    try {
      const userProfile = await this.userService.getUserProfileById(userId);
      if (!userProfile) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(userProfile);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default new UserController();
