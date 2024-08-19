const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");

const {
  getAllProjects,
  getOneProject,
  postNewProject,
  updateProject,
  deleteProject,
} = require("../controller/projectController");

router.get("/", getAllProjects);

router.get("/:id", getOneProject);

router.post("/", isAuthenticated, postNewProject);

router.put("/:id", isAuthenticated, updateProject);

router.delete("/:id", isAuthenticated, deleteProject);

module.exports = router;
