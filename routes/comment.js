import express from "express";
import Comment from "../models/comment.js";

const router = express.Router();

// Route for creating a new comment
router.post("/tasks/:taskId/comments/create", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { text } = req.body;

    // Validate the comment text
    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    // Create a new comment document
    const newComment = new Comment({ taskId, text });

    // Save the comment to the database
    await newComment.save();

    // Redirect the user back to the task details page or another appropriate page
    res.redirect(`/tasks/${taskId}`);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment" });
  }
});

// Route for editing a comment
router.get("/tasks/:taskId/comments/:commentId/edit", async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // Retrieve the comment details from the database
    const comment = await Comment.findById(commentId);

    // Render the comment edit form with the comment data
    res.render("comment/edit", { comment });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving the comment details",
      });
  }
});

// Route for updating a comment
router.put("/tasks/:taskId/comments/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { text } = req.body;

    // Validate the comment text
    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    // Update the comment in the database
    await Comment.findByIdAndUpdate(commentId, { text });

    // Redirect the user back to the task details page or another appropriate page
    res.redirect(`/tasks/${taskId}`);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the comment" });
  }
});

// Route for deleting a comment
router.delete("/tasks/:taskId/comments/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // Delete the comment from the database
    await Comment.findByIdAndDelete(commentId);

    // Perform any necessary cleanup
    // ...

    // Redirect the user back to the task details page or another appropriate page
    res.redirect(`/tasks/${taskId}`);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the comment" });
  }
});

export default router;
