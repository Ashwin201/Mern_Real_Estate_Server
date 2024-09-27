import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getWishlist);
router.post("/add", isAuthenticated, addToWishlist);
router.delete("/remove/:itemId", isAuthenticated, removeFromWishlist);

export default router;
