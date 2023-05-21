import Task from "../models/task.js";

const authorizationMiddleware = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const taskId = req.params.taskId;

    // Perform the authorization check based on your requirements
    // For example, you can check if the current user is the owner of the task

    // Retrieve the task from the database
    const task = await Task.findById(taskId);

    // Check if the task exists
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if the current user is the owner of the task
    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // User is authorized, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while authorizing the user' });
  }
};

export default authorizationMiddleware;
