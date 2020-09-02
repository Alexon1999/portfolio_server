const express = require('express');
const router = express.Router();

const {
  getAllProjects,
  getOneProject,
  postNewProject,
  updateProject,
  deleteProject,
} = require('../controller/projectController');

const { getProjectsByCategory } = require('../controller/categoryController');

router.get('/', getAllProjects);

router.get('/:id', getOneProject);

router.post('/', postNewProject);

router.put('/:id', updateProject);

router.delete('/:id', deleteProject);

router.get('/category/:category', getProjectsByCategory);

module.exports = router;
