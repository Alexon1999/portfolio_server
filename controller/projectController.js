const Project = require('../models/projects');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.json(projects);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'problem with server' });
  }
};

const getOneProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

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

const postNewProject = async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.imgUrl;

  file.mv(`./public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  });

  // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });

  let newProject = new Project({
    ...req.body,
    finie: !!req.body.finie ? true : false,
    react: !!req.body.react ? true : false,
    imgUrl: `/uploads/${file.name}`,
  });

  console.log(newProject);

  try {
    newProject = await newProject.save();

    res.json(newProject);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err);
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    const contactFields = {};

    if (!project) {
      return res
        .status(404)
        .json({ msg: `Not Found a project with this id ${req.params.id}` });
    }

    const { description, name, finie, imgUrl, category, langages } = req.body;

    if (description) contactFields.description = description;
    if (name) contactFields.name = name;
    if (finie) contactFields.finie = finie;
    if (imgUrl) contactFields.imgUrl = imgUrl;
    if (category) contactFields.category = category;
    if (langages) contactFields.langages = langages;

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'problem with server' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(400)
        .json({ msg: `Not Found a project with this id ${req.params.id}` });
    }

    await Project.findByIdAndRemove(req.params.id);

    return res.json({ msg: 'Succesfully deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'A Problem with the server' });
  }
};

module.exports = {
  getAllProjects,
  getOneProject,
  postNewProject,
  updateProject,
  deleteProject,
};
