import axios from "axios";
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const createPaymongoCheckout = async (req, res) => {
    try {
        const { 
            userId,
            customerName,
            phone,
            deliveryAddress,
            billingAddress,
            paymentMethod,
            cartItems,
        } = req.body;

        // get user info
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const email = user.email;

        // get user's cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || !cart.items.length) {
            return res.status(400).json({ error: "Cart is empty." });
        }
        
        let amount = 0;

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        cart.items.forEach(item => {
            amount += item.product.price * item.quantity;
        });

        // cash on delivery
        if (paymentMethod === "cod") {

            //create order
            const order = await Order.create({
                user: userId,
                customerName,
                items: orderItems,
                total: amount,
                paymentMethod: "cod",
                deliveryAddress,
                billingAddress,
                phone,
            });
            // clear cart after successful order creation
            // await Cart.findOneAndUpdate(
            //     { user: userId },
            //     { $set: { items: [] } }
            // );

            return res.json ({
                success: true,
                cod: true,
                message: "Order placed with Cash on Delivery.",
                orderId: order._id
            });
        }

        // for gcash/grab_pay
        const amountInCentavos = amount * 100;
        const allowedMethods = ["gcash", "grab_pay"];
        if (!allowedMethods.includes(paymentMethod)) {
        return res.status(400).json({ error: "Unsupported payment method." });
        }

        const type = paymentMethod;

        const sourceRes = await axios.post(
            "https://api.paymongo.com/v1/sources",
            {
                data: {
                    attributes: {
                        amount: amountInCentavos,
                        currency: "PHP",
                        type,
                        redirect: {
                            // success: "http://localhost:5173/success",
                            // failed: "http://localhost:5173/error",
                            success: "https://mern-not-shopee.onrender.com/success",
                            failed: "https://mern-not-shopee.onrender.com/error",
                            expired: "https://mern-not-shopee.onrender.com/error",
                        },
                        metadata: {
                            userId: userId.toString(),
                            email: email,
                            customerName: JSON.stringify(customerName),
                            phone: phone,
                            deliveryAddress: JSON.stringify(deliveryAddress),
                            billingAddress: JSON.stringify(billingAddress),
                            orderItems: JSON.stringify(orderItems),
                            total: amount.toString(),
                            paymentMethod: paymentMethod,
                        }
                    }
                }
            },
            {
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64"),
                        "Content-Type": "application/json"
                }
            }
        );

        if (!sourceRes?.data?.data?.attributes?.redirect?.checkout_url) {
        throw new Error("Invalid PayMongo response");
        }

        const order = await Order.create({
        user: userId,
        customerName,
        items: orderItems,
        total: amount,
        paymentMethod: type,
        deliveryAddress,
        billingAddress,
        phone,
        status: "Pending Payment",
        paymentId: sourceRes.data.data.id
    });

    const checkoutUrl = sourceRes.data.data.attributes.redirect.checkout_url;
    res.json({ url: checkoutUrl, orderId: order._id });

    } catch (error) {
        console.error("PayMongo error:", error.response?.data || error.message);
        res.status(500).json({ error: "PayMongo session creation failed" });
    }
 };

// verify payment and update order status
export const handlePaymentSuccess = async (req, res) => {
    try {
        const { sourceId } = req.body;

        console.log("Verifying payment for source:", sourceId);

        if (!sourceId) {
            return res.status(400).json({ error: "Source ID is required" });
        }

        // find the order by paymentId
        const order = await Order.findOne({ paymentId: sourceId });
        if (!order) {
            return res.status(404).json({ error: "Order not found for this payment" });
        }

        console.log("Found order:", order._id, "with status:", order.status);

        // if already processed, return success
        if (order.status === "Processing") {
            console.log("Order already processed");
            return res.json({ 
                success: true,
                message: "Payment already confirmed.",
                orderId: order._id
            });
        }

        // verify payment with paymongo
        const sourceRes = await axios.get(
            `https://api.paymongo.com/v1/sources/${sourceId}`,
            {
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64"),
                },
            }
        );
        
        const source = sourceRes.data.data;
        console.log("Payment status:", source.attributes.status);

        if (source.attributes.status === "chargeable" || source.attributes.status === "paid") {
            // update order status to confirmed
            await Order.findByIdAndUpdate(order._id, { 
                status: "Processing" 
            });

            // clear cart after successful payment confirmation
            // await Cart.findOneAndUpdate(
            //     { user: order.user },
            //     { $set: { items: [] } }
            // );

            console.log("Payment confirmed. Order updated");

            res.json({ 
                success: true,
                message: "Payment successful. Order confirmed.",
                orderId: order._id
            });
        } else {
            console.log("Payment failed, status:", source.attributes.status);
            
            // update order status to cancelled
            await Order.findByIdAndUpdate(order._id, { 
                status: "Cancelled" 
            });

            res.status(400).json({ 
                error: "Payment failed. Order cancelled." 
            });
        }
    } catch (error) {
        console.error("Payment verification error:", error.response?.data || error.message);
        res.status(500).json({ error: "Payment verification failed" });
    }
};
