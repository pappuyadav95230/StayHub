const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingContoller = require("../controllers/listings.js");
// Middleware - MOVED TO THE TOP
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Chained Route for "/" (Index and Create)
router.route("/").get(wrapAsync(listingContoller.index)).post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingContoller.createListing)
);

// Search Route - Placed before /new and /:id
router.get("/search", wrapAsync(listingContoller.searchListings));

// New Route (render form)
router.get("/new", isLoggedIn, listingContoller.rederNewFrom);

// Chained Routes for "/:id" (Show, Update, Delete)
router
  .route("/:id")
  .get(wrapAsync(listingContoller.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingContoller.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingContoller.destroyListing));

// Edit Route (render form)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingContoller.rederEditForm)
);

module.exports = router;
