import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password, username } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ email, password: hashedPassword, username });
    await user.save();
    return res.status(201).json({ data: user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
