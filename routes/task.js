import express from "express";
import Task from "../models/task.js";
const router = express.Router();

// GET route for listing tasks
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    let sort = req.query.sort || "createdAt"; // Default sort by creation date
    let sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Sort order (ascending or descending)

    const page = req.query.page || 1;
    const limit = 10; // Number of tasks per page
    const skip = (page - 1) * limit;

    const totalTasks = await Task.countDocuments();

    const tasks = await Task.find(query)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.render("tasks/list", {
      tasks,
      search,
      sort,
      sortOrder,
      totalTasks,
      currentPage: page,
    });
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
router.post("/", authenticationMiddleware, (req, res) => {
  const { title, description, dueDate, categoryId } = req.body;

  if (!title || !categoryId) {
    return res.status(400).json({ error: "Title and category are required" });
  }

  const task = new Task({
    title,
    description,
    dueDate,
    category: categoryId, // Assign the selected category ID to the task
  });

  // Save the task
  task.save((err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "An error occurred while creating the task" });
    }
    return res.status(201).json({ message: "Task created successfully" });
  });
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
router.put("/:id", authenticationMiddleware, (req, res) => {
  const { title, description, dueDate, categoryId } = req.body;

  if (!title || !categoryId) {
    return res.status(400).json({ error: "Title and category are required" });
  }

  Task.findById(req.params.id, (err, task) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "An error occurred while finding the task" });
    }
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.category = categoryId; // Update the task's category ID

    // Save the updated task
    task.save((err) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "An error occurred while updating the task" });
      }
      return res.status(200).json({ message: "Task updated successfully" });
    });
  });
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
