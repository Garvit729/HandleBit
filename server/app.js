import express from "express";
//middleware
dotenv.config();
const app = express();
// MONGOOSE Setup

const PORT = process.env.PORT ;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("database connected successfully");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));