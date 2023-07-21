const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppErrorHandler");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWS_TOKEN, {
    expiresIn: process.env.JWS_EXPIRES,
  });
};

const resToken = (obj, id, res) => {
  const token = signToken(id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWS_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  res.status(201).json({
    status: "sucess",
    token,
    data: { obj },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    picturePath: req.body.picturePath,
    friends: req.body.friends,
    location: req.body.location,
    occupation: req.body.occupation,
    viewedProfile: Math.floor(Math.random() * 10000),
    impressions: Math.floor(Math.random() * 10000),
  });
  
  resToken(user, user._id, res);
});

const logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide Email or Password", 401));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("wrong email/pass", 401));
  }
  resToken(user, user._id, res);
});

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("Not Loged In, Please Signed In", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWS_TOKEN);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError("User Not Exist now", 401));

  if (!currentUser.changePasswordAfter(decoded.iat))
    return next(new AppError("Please Logged InAgain,Pass change", 401));

  req.user = currentUser;
  next();
});
module.exports = { logIn, signUp, protect };
