const express = require("express");
const {
  getUser,
  getUserFriends,
  addRemoveFriend,
} = require("../controllers/userController");
const { protect } = require("../controllers/authController.js");

const userRouter = express.Router();

/* READ */
userRouter.get("/:id/friends", protect, getUserFriends);
userRouter.get("/:id", protect, getUser);


/* UPDATE */
userRouter.patch("/:friendId", protect, addRemoveFriend);

module.exports = userRouter;
