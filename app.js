import express from "express";
import exphbs from "express-handlebars";
import mongoose from "mongoose";

const app = express();

// Configure the app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the MongoDB database
mongoose
  .connect("mongodb://localhost/todo-list-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define routes
app.get("/", (req, res) => {
  res.render("home");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
