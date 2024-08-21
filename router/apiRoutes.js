const express = require("express");
const router = express.Router();
const projectRoutes = require("./projectRoutes");
const categoryRoutes = require("./categoryRoutes");
const { router: emailRoutes } = require("./emailRoutes");

router.use("/categories", categoryRoutes);
router.use("/projects", projectRoutes);
router.use("/post-email", emailRoutes);

module.exports = router;
