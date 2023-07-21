const User = require("../Models/UserModel");
const catchAsync = require("../utils/catchAsync");

// READ
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json(user);
});

const getUserFriends = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );
  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    }
  );
  res.status(200).json(formattedFriends);
});

// UPDATE
const addRemoveFriend = async (req, res, next) => {
  const { friendId } = req.params;
  const user = await User.findById(req.user._id);
  const friend = await User.findById(friendId);

  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((id) => id !== id);
  } else {
    user.friends.push(friendId);
    friend.friends.push(user._id);
  }
  await user.save({ validateBeforeSave: false });
  await friend.save({ validateBeforeSave: false });

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );
  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    }
  );

  res.status(200).json(formattedFriends);
};

module.exports = { getUser, getUserFriends, addRemoveFriend };
