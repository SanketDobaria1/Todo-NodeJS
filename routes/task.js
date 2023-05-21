import express from "express";
import Task from "../models/task.js";
const router = express.Router();

// GET route for listing tasks
router.get("/", async (req, res) => {
  try {
    let sort = req.query.sort || "createdAt"; // Default sort by creation date
    let sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Sort order (ascending or descending)

    const tasks = await Task.find().sort({ [sort]: sortOrder });
    res.render("tasks/list", { tasks, sort, sortOrder });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Error retrieving tasks" });
  }
});

// GET route for creating a new task
router.get("/create", (req, res) => {
  res.render("tasks/create");
});

// POST route for creating a new task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Error creating task" });
  }
});

// GET route for editing a task
router.get("/:id/edit", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if the current user is the owner of the task
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).render("error", { message: "Access Denied" });
    }

    res.render("tasks/edit", { task });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Error retrieving task" });
  }
});

// PUT route for updating a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if the current user is the owner of the task
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).render("error", { message: "Access Denied" });
    }

    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Error updating task" });
  }
});

// DELETE route for deleting a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if the current user is the owner of the task
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).render("error", { message: "Access Denied" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Error deleting task" });
  }
});

export default router;
