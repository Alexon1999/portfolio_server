// routes/categories.js

const express = require("express");
const router = express.Router();
const { listCategories } = require("../controller/categoryController");

// Route to get all categories
router.get("/", listCategories);

module.exports = router;
