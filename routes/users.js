import express from "express";
import User from "../models/user.js";

const router = express.Router();

// Route for viewing user profile
router.get("/profile", async (req, res) => {
  try {
    // Retrieve the logged-in user's information from the database
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Render the profile view with the user data
    res.render("profile", { user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving user profile" });
  }
});

// Route for updating user profile
router.post("/profile/edit", async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    // Validate the user input
    if (!username || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Update the user document in the database
    await User.findByIdAndUpdate(userId, { username, email });

    // Redirect the user back to the profile page or another appropriate page
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user profile" });
  }
});

// Route for changing password
router.post("/profile/password", async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Verify the current password
    const user = await User.findById(userId);
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    // Update the password in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    // Redirect the user back to the profile page or another appropriate page
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while changing password" });
  }
});

// Route for deleting user account
router.post("/profile/delete", async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete the user document from the database
    await User.findByIdAndDelete(userId);

    // Perform any necessary cleanup
    // ...

    // Redirect the user to the home page or another appropriate page
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting user account" });
  }
});

export default router;
