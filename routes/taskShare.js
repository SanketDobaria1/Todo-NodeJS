import express from "express";
import Task from "../models/task.js";
import User from "../models/user.js";

const router = express.Router();

// Route for sharing a task
router.post("/tasks/:taskId/share", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { email } = req.body;

    // Validate the email input
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find the task to be shared
    const task = await Task.findById(taskId);

    // Find the user to share the task with
    const user = await User.findOne({ email });

    // Check if the task or user exists
    if (!task || !user) {
      return res.status(404).json({ error: "Task or user not found" });
    }

    // Add the user to the task's sharedWith array
    task.sharedWith.push(user._id);
    await task.save();

    // Redirect the user back to the task details page or another appropriate page
    res.redirect(`/tasks/${taskId}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while sharing the task" });
  }
});

// Route to unshare a task with a user
router.post("/tasks/:taskId/unshare/:userId", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(400).json({ error: "Task not found" });
    }
    const index = task.sharedWith.indexOf(userId);
    if (index > -1) {
      task.sharedWith.splice(index, 1);
    }
    await task.save();
    res.redirect(`/tasks/${taskId}`);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while unsharing the task" });
  }
});

// Route for managing shared tasks
router.get("/shared-tasks", async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve the shared tasks associated with the user
    const sharedTasks = await Task.find({ sharedWith: userId });

    // Render the shared tasks view with the shared task data
    res.render("shared-tasks", { sharedTasks });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving shared tasks" });
  }
});

export default router;
