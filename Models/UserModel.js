const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      require: [true, "Email is must"],
      validate: [validator.isEmail, "Please provide valid email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: [true, "Please provide a Password"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please provide a Password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords are not same",
      },
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candiatePassword,
  userPassword
) {
  return await bcrypt.compare(candiatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (createdAt) {
  return this.createdAt.getTime() / 1000 - 1 < createdAt;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
