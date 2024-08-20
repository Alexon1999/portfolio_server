const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// mongoose.Schema : it's a contructor function

const projectsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    langages: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    gitRepoUrl: {
      type: String,
      required: true,
    },
    // Reference to the Category schema
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    backend: {
      type: String,
    },
    statut: {
      type: String,
      enum: ["to_do", "in_progress", "finish"],
      required: true,
      default: "to_do",
    },
  },
  { timestamps: true }
);

// mongodb will purialised the 'Blog' => 'blogs'
// it should be singular
const Project = mongoose.model("Project", projectsSchema);

module.exports = Project;
