const Project = require("../models/projects");
const mongoose = require("mongoose");

const NodeCache = require("node-cache");
const projectCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const getAllProjects = async (req, res) => {
  try {
    const { categories, orderby, order } = req.query;

    console.log(req.headers);

    // Check if the request comes from a view by inspecting the custom header
    const isViewRequest = req.headers["x-view-request"] === "true";

    const cacheKey = `projects-${categories || "all"}-${orderby || "default"}-${
      order || "desc"
    }`;

    if (!isViewRequest) {
      // Generate a cache key based on query parameters
      const cachedProjects = projectCache.get(cacheKey);

      // If cached data exists, return it
      if (cachedProjects) {
        return res.json(cachedProjects);
      }
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

    // Cache the result before sending it to the client, but only for non-view requests
    if (!isViewRequest) {
      projectCache.set(cacheKey, projects);
    }

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
  console.log("req.body", req.body);
  try {
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
    let categories_list = [];
    const categories = req.body.categories;
    if (categories) {
      if (typeof categories == "string") categories_list.push(categories);
      else if (Array.isArray(categories)) categories_list = categories;
    }
    categories_list.map((categoryId) => mongoose.Types.ObjectId(categoryId));

    let newProject = new Project({
      ...req.body,
      categories: categories_list,
      imgUrl: `/uploads/${file.name}`,
    });

    newProject = await newProject.save();
    newProject = await newProject.populate("categories").execPopulate();

    res.json(newProject);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err);
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if a file is uploaded
    let imgUrl;
    if (req.files && req.files.imgUrl) {
      const file = req.files.imgUrl;
      file.mv(`./public/uploads/${file.name}`, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
      });
      imgUrl = `/uploads/${file.name}`;
    }

    // Explicitly cast categories to ObjectId
    let categories_list = [];
    const categories = req.body.categories;
    if (categories) {
      if (typeof categories == "string") categories_list.push(categories);
      else if (Array.isArray(categories)) categories_list = categories;
    }
    categories_list.map((categoryId) => mongoose.Types.ObjectId(categoryId));

    // Find the project by ID and update it
    let updatedProject = await Project.findById(id);

    if (!updatedProject) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Update the project fields
    updatedProject.name = req.body.name || updatedProject.name;
    updatedProject.langages = req.body.langages || updatedProject.langages;
    updatedProject.link = req.body.link || updatedProject.link;
    updatedProject.gitRepoUrl =
      req.body.gitRepoUrl || updatedProject.gitRepoUrl;
    updatedProject.backend = req.body.backend || updatedProject.backend;
    updatedProject.description =
      req.body.description || updatedProject.description;
    updatedProject.statut = req.body.statut || updatedProject.statut;
    updatedProject.categories = categories_list.length
      ? categories_list
      : updatedProject.categories;
    if (imgUrl) updatedProject.imgUrl = imgUrl;

    // Save the updated project
    updatedProject = await updatedProject.save();
    updatedProject = await updatedProject.populate("categories").execPopulate();

    res.json(updatedProject);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
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
