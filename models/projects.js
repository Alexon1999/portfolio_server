const mongoose = require('mongoose');
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
    category: {
      type: String,
      required: true,
    },
    react: {
      type: Boolean,
      required: true,
      default: false,
    },
    backend: {
      type: String,
    },
    finie: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// mongodb will purialised the 'Blog' => 'blogs'
// it should be singular
const Project = mongoose.model('Project', projectsSchema);

module.exports = Project;
