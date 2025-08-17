const express = require("express");
const router = express.Router();

// Posts
// Index
router.get("/", (req, res) => {
  res.send("Hi, I am post!");
});

// show
router.get("/:id", (req, res) => {
  res.send("GET for  post");
});

// POST
router.post("/", (req, res) => {
  res.send("POST for post");
});

// DELETE
router.delete("/:id", (req, res) => {
  res.send("/Delete for post id ");
});

module.exports = router;
