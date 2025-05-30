import express from "express";
import { createPaymongoCheckout, handlePaymentSuccess } from "../controller/checkout.controller.js";
const router = express.Router();

router.post("/paymongo", createPaymongoCheckout);
router.post("/payment-success", handlePaymentSuccess);

// Test endpoint
router.get("/test", (req, res) => {
    res.json({ message: "Checkout routes are working!" });
});

export default router;