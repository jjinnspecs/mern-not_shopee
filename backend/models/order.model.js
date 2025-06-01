import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending Payment","Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing"
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "gcash", "grab_pay"],
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  billingAddress: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  paymentId: { type: String }, // for online payments
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);