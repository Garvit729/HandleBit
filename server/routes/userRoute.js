import express from "express";
import {
  registerStudent,
  registerFaculty,
  getUsers,
} from "../controllers/userController.js";
import { checkRole } from "../middleware/authMiddleware.js";
import {
  facultyValidationRules,
  studentValidationRules,
} from "../middleware/validationMiddleware.js";

const router = express.Router();
router.post("/registerStudent", studentValidationRules, registerStudent);

export default router;
