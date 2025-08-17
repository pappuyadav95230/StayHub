const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listings.js");
// THIS LINE IS NOW CORRECTED to match your actual filename
const reviews = require("./routes/review.js");

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to Db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Set views engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// define session option
const sessionOption = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// using session
app.use(session(sessionOption));
app.use(flash());

// for flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");

  next();
});

// Listing and Review routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Robust 404 handler - This fixes the original "Missing parameter name" error
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Custom error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
