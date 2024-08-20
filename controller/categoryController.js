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

module.exports = {
  listCategories,
};
