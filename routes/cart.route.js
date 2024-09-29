import express from "express";
import {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
  resetCart,
} from "../controllers/cart.controller.js";
import { Checkout } from "../controllers/checkout.controller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update/:itemId", isAuthenticated, updateCartItem);
router.delete("/remove/:itemId", isAuthenticated, removeCartItem);
router.delete("/reset", isAuthenticated, resetCart);
router.post("/checkout", isAuthenticated, Checkout);
export default router;
