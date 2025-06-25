// controllers/payment.controller.js

import axios from "axios";
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const PAYMONGO_API = "https://api.paymongo.com/v1";
const REDIRECT_URLS = {
  success: "https://mern-not-shopee.onrender.com/success",
  failed: "https://mern-not-shopee.onrender.com/error",
  expired: "https://mern-not-shopee.onrender.com/error",
};
const ALLOWED_PAYMENT_METHODS = ["gcash", "grab_pay"];

// Helper: Format PayMongo headers
const paymongoHeaders = () => ({
  Authorization: "Basic " + Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString("base64"),
  "Content-Type": "application/json",
});

// Helper: Calculate total cart amount
const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const createPaymongoCheckout = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      phone,
      deliveryAddress,
      billingAddress,
      paymentMethod,
    } = req.body;

    // Validate user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Validate cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || !cart.items.length) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));
    const amount = calculateTotal(cart.items);

    // Cash on Delivery flow
    if (paymentMethod === "cod") {
      const order = await Order.create({
        user: userId,
        customerName,
        items: orderItems,
        total: amount,
        paymentMethod,
        deliveryAddress,
        billingAddress,
        phone,
      });

      return res.json({
        success: true,
        cod: true,
        message: "Order placed with Cash on Delivery.",
        orderId: order._id,
      });
    }

    // Online payment flow (gcash/grab_pay)
    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ error: "Unsupported payment method." });
    }

    const payload = {
      data: {
        attributes: {
          amount: amount * 100,
          currency: "PHP",
          type: paymentMethod,
          redirect: REDIRECT_URLS,
          metadata: {
            userId: userId.toString(),
            email: user.email,
            customerName: JSON.stringify(customerName),
            phone,
            deliveryAddress: JSON.stringify(deliveryAddress),
            billingAddress: JSON.stringify(billingAddress),
            orderItems: JSON.stringify(orderItems),
            total: amount.toString(),
            paymentMethod,
          },
        },
      },
    };

    const sourceRes = await axios.post(`${PAYMONGO_API}/sources`, payload, {
      headers: paymongoHeaders(),
    });

    const checkoutUrl = sourceRes?.data?.data?.attributes?.redirect?.checkout_url;
    if (!checkoutUrl) throw new Error("Invalid PayMongo response");

    res.json({ url: checkoutUrl });

  } catch (error) {
    console.error("Checkout error:", error.response?.data || error.message);
    res.status(500).json({ error: "PayMongo session creation failed" });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  try {
    const { sourceId } = req.body;
    if (!sourceId) return res.status(400).json({ error: "Source ID is required" });

    const sourceRes = await axios.get(`${PAYMONGO_API}/sources/${sourceId}`, {
      headers: paymongoHeaders(),
    });

    const source = sourceRes.data.data;
    const status = source.attributes.status;

    if (status !== "paid") {
      await Order.findOneAndUpdate({ paymentId: sourceId }, { status: "Cancelled" });
      return res.status(400).json({ error: "Payment failed. Order cancelled." });
    }

    const meta = source.attributes.metadata;
    const existingOrder = await Order.findOne({ paymentId: sourceId });

    if (!existingOrder) {
      const newOrder = await Order.create({
        user: meta.userId,
        customerName: JSON.parse(meta.customerName),
        items: JSON.parse(meta.orderItems),
        total: parseFloat(meta.total),
        paymentMethod: meta.paymentMethod,
        deliveryAddress: JSON.parse(meta.deliveryAddress),
        billingAddress: JSON.parse(meta.billingAddress),
        phone: meta.phone,
        status: "Processing",
        paymentId: sourceId,
      });

      await Cart.findOneAndUpdate({ user: meta.userId }, { $set: { items: [] } });

      return res.json({
        success: true,
        message: "Payment successful. Order confirmed.",
        orderId: newOrder._id,
      });
    }

    // Order exists but not in correct status
    if (existingOrder.status !== "Processing") {
      await Order.findByIdAndUpdate(existingOrder._id, { status: "Processing" });
    }

    res.json({
      success: true,
      message: "Payment confirmed.",
      orderId: existingOrder._id,
    });

  } catch (error) {
    console.error("Payment verification error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
};
