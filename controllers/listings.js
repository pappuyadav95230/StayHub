// const Listing = require("../models/listing");

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

// module.exports.rederNewFrom = (req, res) => {
//   res.render("listings/new.ejs");
// };

// module.exports.showListing = async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id)
//     .populate({
//       path: "reviews",
//       populate: {
//         path: "author",
//       },
//     })
//     .populate("owner");
//   if (!listing) {
//     req.flash("error", "Listings you request for does not exist!");
//     return res.redirect("/listings");
//   }
//   console.log(listing);
//   res.render("listings/show.ejs", { listing });
// };

// module.exports.createListing = async (req, res, next) => {
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   await newListing.save();
//   req.flash("success", "Successfully made a new listing!");
//   res.redirect("/listings");
// };

// module.exports.rederEditForm = async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing) {
//     req.flash("error", "Listings you request for does not exist!");
//     return res.redirect("/listings");
//   }
//   res.render("listings/edit.ejs", { listing });
// };

// module.exports.updateListing = async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   req.flash("success", "Listing Updated!");
//   res.redirect(`/listings/${id}`);
// };

// module.exports.destroyListing = async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   req.flash("success", "Successfully Listing Deleted!");
//   res.redirect("/listings");
// };

const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Handle location-based search
module.exports.searchListings = async (req, res) => {
  const { q } = req.query; // Get the search query from the URL (e.g., ?q=Patna)

  // Find listings where the location matches the query, case-insensitively
  const allListings = await Listing.find({
    location: { $regex: new RegExp(q, "i") },
  });

  // If no listings are found, flash a message and redirect to the main listings page
  if (allListings.length === 0) {
    req.flash(
      "error",
      `No listings found in "${q}". Showing all listings instead.`
    );
    return res.redirect("/listings");
  }

  // If listings are found, render the index page with the search results
  res.render("listings/index.ejs", { allListings });
};

// Render the form to create a new listing
module.exports.rederNewFrom = (req, res) => {
  res.render("listings/new.ejs");
};

// Show a specific listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// Create a new listing
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

// Render the form to edit a listing
module.exports.rederEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    ("/upload/", "/upload/w_300,h_200")
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update a listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// Delete a listing
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
