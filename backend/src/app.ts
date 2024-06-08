import "dotenv/config";
import express, { Application, Request, Response } from "express";
import { connectDatabase } from "./config/mongo.config";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/authMiddleware";
import reviewRoutes from "./routes/review.routes";
import reviewSecuredRoutes from "./routes/review.secured.routes";
import userRoutes from "./routes/user.routes";
const cors = require("cors");

//---------------------------------------------------------------

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
// this middleware will apply to all routes after this line
app.use(authMiddleware);
app.use("/api/reviews/sec", reviewSecuredRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
