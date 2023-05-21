import express from "express";
import exphbs from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash";
import passport from "./config/passport.js";

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

// Configure session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Define routes
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/users", require("./routes/users.js"));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
