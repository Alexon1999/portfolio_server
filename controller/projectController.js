const Project = require("../models/projects");
const mongoose = require("mongoose");

const NodeCache = require("node-cache");
const projectCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const getAllProjects = async (req, res) => {
  try {
    const { categories, orderby, order } = req.query;

    // Generate a cache key based on query parameters
    const cacheKey = `projects-${categories || "all"}-${orderby || "default"}-${
      order || "desc"
    }`;
    const cachedProjects = projectCache.get(cacheKey);

    // If cached data exists, return it
    if (cachedProjects) {
      return res.json(cachedProjects);
    }

    // Build the query object
    let query = {};
    if (categories) {
      // Support filtering by multiple categories
      query.categories = { $in: categories.split(",") };
    }

    // Build the sort object
    let sort = {};
    if (orderby) {
      const orderFields = orderby.split(",");
      const orderDirections = (order || "").split(",");

      orderFields.forEach((field, index) => {
        const direction = orderDirections[index] === "asc" ? 1 : -1;
        sort[field] = direction;
      });
    }

    // Execute the query with sorting and populate categories
    const projects = await Project.find(query)
      .sort(sort)
      .populate("categories");

    // Cache the result before sending it to the client
    projectCache.set(cacheKey, projects);

    res.json(projects);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Problem with server" });
  }
};

const getOneProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "categories"
    );

    if (!project) {
      return res
        .status(400)
        .json({ msg: `Not Found a project with this id ${req.params.id}` });
    }

    return res.json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "problem with server" });
  }
};

const postNewProject = async (req, res) => {
  // console.log("req.body", req.body);

  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.imgUrl;

  file.mv(`./public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  });

  // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });

  // Explicitly cast categories to ObjectId
  const categories = req.body.categories.map((categoryId) =>
    mongoose.Types.ObjectId(categoryId)
  );

  let newProject = new Project({
    ...req.body,
    categories,
    imgUrl: `/uploads/${file.name}`,
  });

  try {
    newProject = await newProject.save();
    newProject = await newProject.populate("categories").execPopulate();

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
    if (imgUrl) contactFields.imgUrl = imgUrl;
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
    res.status(500).json({ msg: "problem with server" });
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

    return res.json({ msg: "Succesfully deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "A Problem with the server" });
  }
};

module.exports = {
  getAllProjects,
  getOneProject,
  postNewProject,
  updateProject,
  deleteProject,
};
