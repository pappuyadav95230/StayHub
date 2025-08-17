// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     type: String,
//     default:
//       "https://unsplash.com/photos/sunset-on-the-beach-with-a-surfer-NgvCdjrW1tE",
//     set: (v) =>
//       v === ""
//         ? "https://unsplash.com/photos/the-sun-is-setting-over-a-beach-with-a-rock-formation-uDXmvInA_wY"
//         : v,
//   },
//   price: Number,
//   location: String,
//   country: String,
// });

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // Direct image URL
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0" // Another direct image URL
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // assuming your Review model is named "Review"
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
