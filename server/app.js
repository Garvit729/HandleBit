import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
//middleware
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());



// ROUTES


app.use("/admin", adminRoutes);
// MONGOOSE Setup

const PORT = process.env.PORT ;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("database connected successfully");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));