import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  email: string;
  password: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: {
      type: String,
      required: true,
      match: /^[A-Za-z0-9]+$/,
      minlength: 3,
      maxlength: 30,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
