import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
//middleware
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());


// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB size limit
});


// ROUTES


app.use("/committee", committeeRoutes);
app.use("/admin", adminRoutes);
app.use("/events", eventRoutes);
app.use("/user", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("*", (req, res) => {
  res.status(404).send({
    success: false,
    message: "Page Not Exists!",
  });
});
// MONGOOSE Setup

const PORT = process.env.PORT ;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("database connected successfully");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));