const express = require('express');
const router = express.Router();

const {
  getAllProjects,
  getOneProject,
  postNewProject,
  updateProject,
  deleteProject,
} = require('../controller/projectController');

router.get('/', getAllProjects);

router.get('/:id', getOneProject);

router.post('/', postNewProject);

router.put('/:id', updateProject);

router.delete('/:id', deleteProject);

module.exports = router;
