import express from "express";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controller/order.controller.js";
const router = express.Router();

router.post("/", createOrder);
router.get("/user/:userId", getUserOrders); 
router.get("/", getAllOrders); 
router.put("/:orderId/status", updateOrderStatus); 

export default router;