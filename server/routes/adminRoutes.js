import express from "express";
import {
  verifyAdmin,
} from "../controllers/adminController.js";


const router = express.Router();


router.post("/verify", verifyAdmin);


export default router;

