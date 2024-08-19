// createUser.js

const mongoose = require("mongoose");
const User = require("../models/users"); // Adjust the path if your User model is in a different directory
const readline = require("readline");
const ConnectDb = require("../db/db");

require("dotenv").config();

// Set up mongoose connection
ConnectDb();

// Create a readline interface to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createUser = async (username, password) => {
  try {
    const user = new User({ username, password });
    await user.save();
    console.log("User created successfully");
  } catch (err) {
    console.error("Error creating user:", err.message);
  } finally {
    mongoose.connection.close();
    rl.close();
  }
};

// Prompt user for username and password
rl.question("Enter username: ", (username) => {
  rl.question("Enter password: ", (password) => {
    createUser(username, password);
  });
});
