import express from "express";
import {
  verifyAdmin,
  logout
} from "../controllers/adminController.js";


const router = express.Router();


router.post("/verify", verifyAdmin);
router.post("/logout", logout);


export default router;

