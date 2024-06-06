import mongoose, { Schema } from "mongoose";

export interface IReview extends Document {
  googleMapsUrl: string;
  userId: string;
  rating: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema({
  googleMapsUrl: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: {
    type: Number,
    required: true,
    min: 1.0,
    max: 10.0,
    validate: {
      validator: function (v: number) {
        return /^(\d+\.\d)$/.test(v.toString());
      },
      message: (props: any) =>
        `${props.value} is not a valid rating. Only one decimal place is allowed.`,
    },
  },

  // Dodanie walidacji dla pola comment
  comment: {
    type: String,
    required: true,
    maxlength: 500,
  },
});

const Review = mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
