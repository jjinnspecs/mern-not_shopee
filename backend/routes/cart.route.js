import express from "express";
import { addToCart, getCart, removeFromCart, updateQuantity } from "../controller/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.post("/remove", removeFromCart);
router.post("/update-quantity", updateQuantity);

export default router;