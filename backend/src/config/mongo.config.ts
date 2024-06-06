// src/config/mongo.config.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
