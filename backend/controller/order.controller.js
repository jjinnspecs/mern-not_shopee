import Order from "../models/order.model.js";

// create order (called after successful checkout)
export const createOrder = async (req, res) => {
  try {
    const { user, items, total } = req.body;
    const order = await Order.create({ user, items, total });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// get orders for a user (order history)
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).populate("items.product");
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("items.product");
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
    .populate("user")
    .populate("items.product");
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};