import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to mongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });
const port = 3000;
const app = express();

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

app.use("/api/user", userRouter);
