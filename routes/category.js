import express from "express";
import Category from "../models/category.js";

const router = express.Router();

// Route for creating a new category
router.post("/categories/create", async (req, res) => {
  try {
    const { name } = req.body;

    // Validate the category name
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Create a new category document
    const newCategory = new Category({ name });

    // Save the category to the database
    await newCategory.save();

    // Redirect the user to the categories list or another appropriate page
    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the category" });
  }
});

// Route for editing a category
router.get("/categories/:id/edit", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Retrieve the category details from the database
    const category = await Category.findById(categoryId);

    // Render the category edit form with the category data
    res.render("category/edit", { category });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while retrieving the category details",
    });
  }
});

// Route for updating a category
router.put("/categories/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    // Validate the category name
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Update the category in the database
    await Category.findByIdAndUpdate(categoryId, { name });

    // Redirect the user to the categories list or another appropriate page
    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the category" });
  }
});

// Route for deleting a category
router.delete("/categories/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Delete the category from the database
    await Category.findByIdAndDelete(categoryId);

    // Perform any necessary cleanup
    // ...

    // Redirect the user to the categories list or another appropriate page
    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the category" });
  }
});

export default router;
