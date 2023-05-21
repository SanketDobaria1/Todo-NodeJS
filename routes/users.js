import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import passport from "../config/passport.js";
import User from "../models/User.js";

// GET route for user registration
router.get("/register", (req, res) => {
  res.render("users/register");
});

// POST route for user registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      req.flash("error", "Username already exists");
      return res.redirect("/users/register");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/users/login");
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Error registering user" });
  }
});

// GET route for user login
router.get("/login", (req, res) => {
  res.render("users/login");
});

// POST route for user login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/tasks",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

// GET route for user logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have been logged out");
  res.redirect("/users/login");
});

export default router;
