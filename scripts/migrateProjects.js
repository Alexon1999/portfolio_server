const mongoose = require("mongoose");
const Project = require("../models/projects");
const Category = require("../models/categories");
const ConnectDb = require("../db/db");

require("dotenv").config();

const migrateProjects = async () => {
  try {
    await ConnectDb();

    // Step 1: Fetch all projects
    const projects = await Project.find();

    // Step 2: Loop through each project and update it
    for (let project of projects) {
      console.log("project", project);
      // Convert finie to statut
      if (project.finie) {
        project.statut = project.finie ? "finish" : "in_progress";
      }

      // Handle the conversion of category to categories
      if (project.category) {
        let categoryName = project.category;

        // Check if this category already exists
        let category = await Category.findOne({ name: categoryName });

        // If it doesn't exist, create it
        if (!category) {
          category = new Category({ name: categoryName });
          await category.save();
        }

        // Assign the category to the project's categories array
        project.categories = [category._id];
      }

      let react_category = await Category.findOne({ name: "react.js" });
      if (!react_category) {
        react_category = new Category({ name: categoryName });
        await react_category.save();
      }

      if (project.react && react_category) {
        project.categories.push(react_category._id);
      }
      // Save the updated project
      await project.save();
    }

    // Update all projects by removing the fields
    await Project.updateMany(
      {},
      { $unset: { category: "", react: "", finie: "" } }
    );

    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Error during migration:", err);
  } finally {
    mongoose.connection.close();
  }
};

migrateProjects();
