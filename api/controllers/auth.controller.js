import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const Signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  let lowerCaseError = null;

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfullly!" });
    console.log("User created successfullly!");
  } catch (err) {
    lowerCaseError = err.message.toLowerCase();
    if (
      lowerCaseError.includes("duplicate") &&
      lowerCaseError.includes("username")
    ) {
      err.message = "Username already exists.";
    } else if (
      lowerCaseError.includes("duplicate") &&
      lowerCaseError.includes("email")
    ) {
      err.message = "Email already exists.";
    }
    next(err);
    console.log(err.message);
  }
};

export const Signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found."));
    //  console.log(validUser);
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    // console.log(validPassword);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials."));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    //console.log(process.env.JWT_SECRET);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
