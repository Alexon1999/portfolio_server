const Project = require('../models/projects');

const getProjectsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    let project;

    switch (category) {
      case 'tous':
        project = await Project.find().sort({
          createdAt: 1,
        });
        break;
      case 'react':
        project = await Project.find({ react: true }).sort({
          createdAt: 1,
        });
        break;
      default:
        project = await Project.find({ category }).sort({
          createdAt: 1,
        });
    }

    if (!project) {
      return res
        .status(400)
        .json({ msg: `Not Found a project with this id ${req.params.id}` });
    }

    return res.json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'problem with server' });
  }
};

module.exports = {
  getProjectsByCategory,
};
