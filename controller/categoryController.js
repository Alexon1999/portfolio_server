const Category = require("../models/categories");

// Controller function to list all categories
const listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // Sort categories alphabetically by name
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const postNewCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create a new category
    const newCategory = new Category({
      name,
      description,
    });

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    // Respond with the newly created category
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get one category by ID
const getOneCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category's name and description if provided
    category.name = name || category.name;
    category.description = description || category.description;

    category = await category.save();

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.remove();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  listCategories,
  postNewCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
