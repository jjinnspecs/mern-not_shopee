import express from "express";
import { createPaymongoCheckout } from "../controller/checkout.controller.js";
const router = express.Router();

router.post("/paymongo", createPaymongoCheckout);

export default router;