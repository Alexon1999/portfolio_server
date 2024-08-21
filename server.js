const express = require("express");
const fileUploader = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const methodOverride = require("method-override");

const ConnectDb = require("./db/db");
const apiRoutes = require("./router/apiRoutes");
const { isAuthenticated } = require("./middlewares/auth");
const User = require("./models/users");
const Project = require("./models/projects");
const Category = require("./models/categories");
const { deleteCategory } = require("./controller/categoryController");

require("dotenv").config();

const app = express();

ConnectDb();
// .then(() =>
//   app.listen(port, () => console.log(`Server running on Port ${port}`))
// );

app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
  req.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(cors());
app.use(fileUploader());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(methodOverride("_method"));

// Render login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// Handle logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/", isAuthenticated, (req, res) => {
  res.render("index");
});

app.get("/projects-view", isAuthenticated, (req, res) => {
  res.render("projects/index");
});
app.get("/projects-view/create", isAuthenticated, (req, res) => {
  res.render("projects/create-projects");
});
app.get("/projects-view/:id/edit", isAuthenticated, async (req, res) => {
  const project = await Project.findById(req.params.id).populate("categories");

  if (project) {
    return res.render("projects/edit-projects", {
      project,
    });
  }
  res.render(500).send("Project doesn't exist");
});

app.get("/categories-view", isAuthenticated, (req, res) => {
  res.render("categories/index");
});
app.get("/categories-view/create", isAuthenticated, (req, res) => {
  res.render("categories/create-categories");
});
app.get("/categories-view/:id/edit", isAuthenticated, async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    return res.render("categories/edit-categories", {
      category,
    });
  }
  res.render(500).send("Category doesn't exist");
});

app.use(express.static("public"));

app.use("/api", apiRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on Port ${port}`));
