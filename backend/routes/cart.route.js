import express from "express";
import { addToCart, getCart, removeFromCart, updateQuantity, clearCart } from "../controller/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.post("/remove", removeFromCart);
router.post("/update-quantity", updateQuantity);
router.post("/clear", clearCart);

export default router;