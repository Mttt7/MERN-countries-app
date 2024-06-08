import mongoose, { Schema } from "mongoose";

export interface IReview extends Document {
  googleMapsUrl: string;
  userId: string;
  rating: number;
  comment: string;
  photoUrl: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  city: string;
}

const ReviewSchema: Schema = new Schema(
  {
    googleMapsUrl: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, minlength: 5, maxlength: 50 },
    city: { type: String, required: true, minlength: 3, maxlength: 50 },
    rating: {
      type: Number,
      required: true,
      min: 1.0,
      max: 10.0,
      validate: {
        validator: function (v: number) {
          if (Number.isInteger(v) && v >= 1 && v <= 10) return true;
          return /^(\d+\.\d)$/.test(v.toString());
        },
        message: (props: any) =>
          `${props.value} is not a valid rating. Only one decimal place is allowed.`,
      },
    },
    photoUrl: { type: String, required: false },

    comment: {
      type: String,
      required: true,
      maxlength: 500,
      minlength: 30,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
