import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
// import path from "path";
//Routes
import UserRoutes from "./routes/user.route.js";
import CartRoutes from "./routes/cart.route.js";
import WishlistRoutes from "./routes/wishlist.route.js";
import PostRoutes from "./routes/post.route.js";
import CheckoutRoutes from "./routes/checkout.route.js";

dotenv.config();

const app = express();

// const _dirname = path.resolve();
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// All Api's
app.use("/api/user", UserRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/checkout", CheckoutRoutes);
app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

const port = process.env.PORT || 8001;
app.listen(port, (req, res) => {
  try {
    connectDB();
    console.log(`Server is runnig at port ${port}.`);
  } catch (error) {
    console.log(`Server is not running currently.`, error);
  }
});
