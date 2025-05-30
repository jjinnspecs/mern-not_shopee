import Cart from "../models/cart.model.js";

export const addToCart = async (req, res) => {
    const { userId, productId, quantity = 1 } = req.body;

    if(!userId || !productId) {
        return res.status(400).json({ success: false, message: "User and product are required"});
    }
    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [{ product: productId, quantity}] });
        } else {
            const item = cart.items.find(i => i.product.toString() === productId);
            if (item) {
                item.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }
        await cart.save();
        await cart.populate("items.product");
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// get cart
export const getCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        res.json({ success: true, cart});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// remove item from cart
export const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found "});
        cart.items = cart.items.filter(i => i.product.toString() !== productId);
        await cart.save();
        await cart.populate("items.product");
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// updating quantity
export const updateQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
        const item = cart.items.find(i => i.product.toString() === productId);
        if (!item) return res.status(404).json({ success: false, message: "Product not in cart" });
        item.quantity = quantity;
        await cart.save();
        // repopulate product details for frontend
        await cart.populate("items.product");
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// clear cart
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
        cart.items = [];
        await cart.save();
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to clear cart" });
    }
};