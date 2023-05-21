// routes/auth.js

import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = express.Router();

// GET route for user registration
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Route for user registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

// GET route for user login
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Route for user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const sessionToken = generateSessionToken();

    res.cookie("sessionToken", sessionToken);

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// GET route for user logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have been logged out");
  res.redirect("/users/login");
});


// Helper function to generate a session token
const generateSessionToken = () => {
  // Generate a unique session token using a library or algorithm of your choice
  // Example: const sessionToken = generateUniqueToken();
  // Replace this with your actual session token generation code
  const sessionToken = "example-session-token";
  return sessionToken;
};

export default router;
