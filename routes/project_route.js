const express = require("express");
const router = express.Router();
const Project = require("./../model/project");
const verifyToken = require("./../middleware/auth"); // <--- import verifyToken middleware

//@description     Create a project
//@route           POST /api/projects
//@access          Private

router.use(verifyToken); // <--- apply verifyToken middleware to all routes in this file (project_route.js

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!(name && description)) {
      res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: "All input are required",
        },
      });
    }
    const project = await Project.create({
      name,
      description,
      user_id: req.user.user_id,
    });
    res.status(201).json({ success: true, payload: project });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

//@description     List all projects
//@route           GET /api/projects
//@access          Private

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ user_id: req.user.user_id });
    res.status(200).json({ success: true, payload: projects });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

//@description     Get a project
//@route           GET /api/projects/:id
//@access          Private

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user_id: req.user.user_id,
    });
    if (!project) {
      res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: "Project not found",
        },
      });
    }
    res.status(200).json({ success: true, payload: project });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

//@description     Update a project
//@route           PUT /api/projects/:id
//@access          Private

router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!(name && description)) {
      res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: "All input are required",
        },
      });
    }
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user.user_id,
      },
      {
        name,
        description,
      },
      {
        new: true,
      }
    );
    if (!project) {
      res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: "Project not found",
        },
      });
    }
    res.status(200).json({ success: true, payload: project });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

//@description     Delete a project
//@route           DELETE /api/projects/:id
//@access          Private

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.user_id,
    });
    if (!project) {
      res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: "Project not found",
        },
      });
    }
    res.status(200).json({ success: true, payload: project });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

module.exports = router;
