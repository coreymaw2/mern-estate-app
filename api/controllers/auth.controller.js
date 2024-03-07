import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
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
