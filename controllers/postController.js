const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync.js");
const User=require('../Models/UserModel')

/* CREATE */
 const createPost = catchAsync(async (req, res, next) => {
  const { userId, description, picturePath } = req.body;
  const user = await User.findById(userId);
  await Post.create({
    userId,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    description,
    userPicturePath: user.picturePath,
    picturePath,
    likes: {},
    comments: [],
  });

  const post = await Post.find();
  res.status(201).json(post);
});

/* READ */
 const getFeedPosts = catchAsync(async (req, res, next) => {
  const post = await Post.find();
  res.status(200).json(post);
});

 const getUserPosts = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const post = await Post.find({ userId });
  res.status(200).json(post);
});

/* UPDATE */
 const likePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findById(id);
  const isLiked = post.likes.get(userId);

  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likes: post.likes },
    { new: true }
  );

  res.status(200).json(updatedPost);
});

module.exports={createPost,likePost,getUserPosts,getFeedPosts}
