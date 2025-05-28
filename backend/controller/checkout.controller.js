import axios from "axios";
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js"

export const createPaymongoCheckout = async (req, res) => {
    try {
        const { 
            userId,
            phone,
            deliveryAddress,
            billingAddress,
            paymentMethod,
            cartItems
        } = req.body;

        //get user info
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const email = user.email;

        //get user's cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || !cart.items.length) {
            return res.status(400).json({ error: "Cart is empty." });
        }
        
        let amount = 0;
        cart.items.forEach(item => {
            amount += item.product.price * item.quantity;
        });

        //cash on delivery
        if (paymentMethod === "cod") {
            return res.json ({
                success: true,
                cod: true,
                message: "Order placed with Cash on Delivery." 
            });
        }

        //for gcash/gotyme
        const amountInCentavos = amount * 100;
        let type = "gcash";
       if (paymentMethod === "grab_pay") type = "grab_pay";
        else type = "gcash";

        const sourceRes = await axios.post(
            "https://api.paymongo.com/v1/sources",
            {
                data: {
                    attributes: {
                        amount: amountInCentavos,
                        currency: "PHP",
                        type,
                        redirect: {
                            success: "https://mern-not-shopee.onrender.com/success",
                            failed: "https://mern-not-shopee.onrender.com/error",
                        },
                        metadata: {
                            email,
                            phone,
                            deliveryAddress,
                            billingAddress,
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

        const checkoutUrl = sourceRes.data.data.attributes.redirect.checkout_url;
        res.json({ url: checkoutUrl});
    } catch (error) {
        console.error("PayMongo error:", error.response?.data || error.message);
        res.status(500).json({ error: "PayMongo session creation failed" });
    }
 };