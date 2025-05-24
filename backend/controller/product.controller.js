import mongoose from 'mongoose';
import Product from '../models/product.model.js';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error in Fetching products:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const createProduct = async (req, res) => {
    const product = req.body; // user will send the product data in the request body

    if(!product.name || !product.price || !product.category || !product.image) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }

    const newProduct = new Product(product)

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct});
    } catch (error) {
        console.error("Error in Creating product:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
     
    const product = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success:false, message: 'Invalid product ID' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error in Updating product:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    console.log("Deleting product with ID:", id);

        if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success:false, message: 'Invalid product ID' });
    }

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error in Deleting product:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}
