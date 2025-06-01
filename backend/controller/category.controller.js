import mongoose from "mongoose";
import Category from "../models/category.model.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error("Error in Fetching categories:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const createCategory = async (req, res) => {
    const category = req.body; // user will send the category data in the request body

    if(!category.name) {
        return res.status(400).json({ message: 'Please fill the category name field' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: `^${category.name}$`, $options: "i"} });
    if (existingCategory) {
        return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const newCategory = new Category(category)

    try {
        await newCategory.save();
        res.status(201).json({ success: true, data: newCategory});
    } catch (error) {
        console.error("Error in Creating category:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const updateCategory = async (req, res) => {
    const { id } = req.params;

    const category = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success:false, message: 'Invalid category ID'});
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: `^${category.name}$`, $options: "i" }
    });
    if (existingCategory) {
        return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    try {
        const updatedProduct = await Category.findByIdAndUpdate(id, category, { new: true });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found'});
        } 
        res.status(200).json({ success: true, data: updatedProduct });
    }catch (error) {
            console.error("Error in Updating category:", error.message);
            res.status(500).json({ success: false, message: 'Server Error'});
        }   
    }

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    console.log("Deleting category with ID:", id);

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success:false, message: 'Invalid category ID' });
    }

    try {
        const category = await Category.findByIdAndDelete(id);

        if(!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Error in Deleting category:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}