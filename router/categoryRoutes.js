// routes/categories.js

const express = require("express");
const router = express.Router();
const {
  listCategories,
  postNewCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const { isAuthenticated } = require("../middlewares/auth");

// Route to get all categories
router.get("/", listCategories);
router.get("/:id", getOneCategory);
router.post("/", isAuthenticated, postNewCategory);
router.put("/:id", isAuthenticated, updateCategory);
router.delete("/:id", isAuthenticated, deleteCategory);

module.exports = router;
