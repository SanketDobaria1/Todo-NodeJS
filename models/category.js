import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;