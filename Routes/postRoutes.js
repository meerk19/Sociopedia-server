const express = require("express");
const {
  getFeedPosts,
  getUserPosts,
  likePost,
} = require("../controllers/postController");

const { protect } = require("../controllers/authController.js");
const postRouter = express.Router();

// READ
postRouter.get("/", protect, getFeedPosts);
postRouter.route("/:userId/posts").get(protect, getUserPosts);

/* UPDATE */
postRouter.patch("/:id/like", protect, likePost);

module.exports = postRouter;
