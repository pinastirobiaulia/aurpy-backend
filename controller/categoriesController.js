const Category = require('../models/category');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: err.message }); 
    }
};

// Add new category
const addCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const duplikat = await Category.findOne({ name });
        if (duplikat) {
            throw new Error("Category name already exists");
        }

        const newCategory = new Category({ name });
        const addCat = await newCategory.save();
        res.status(201).json({ addCat, message: "Category added successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

// Search categories
const searchCategories = async (req, res) => {
    const { query } = req.query;

    try {
        const categories = await Category.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json({ categories });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

// Update category
const updateCategories = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        // Check if the category with the specified ID exists
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check for duplicate category name
        const duplicateCategory = await Category.findOne({ name });
        if (existingCategory.name !== name && duplicateCategory) {
            return res.status(400).json({ message: "Category name already exists" });
        }

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        res.status(200).json({ updatedCategory, message: "Category updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};


// Delete category
const deleteCategories = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            throw new Error("Category not found");
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllCategories,
    addCategory,
    searchCategories,
    updateCategories,
    deleteCategories,
};
