import express from "express";
import { Checkout } from "../controllers/checkout.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
const router = express.Router();

router.post("/", isAuthenticated, Checkout);
export default router;
