import express from "express";
import {
  getConvenors,
  verifyAdmin,
  addConvenor,
  deleteConvenor,
  logout,
} from "../controllers/adminController.js";
import { checkRole } from "../middleware/authMiddleware.js";
import {
  changePasswordValidationRules,
  convenorValidationRules,
  memberValidationRules,
} from "../middleware/validationMiddleware.js";


const router = express.Router();


router.post("/verify", verifyAdmin);
router.post("/logout", logout);
router.get("/convenors", checkRole(["admin"]), getConvenors);
router.post(
  "/addConvenor",
  checkRole(["admin"]),
  convenorValidationRules,
  addConvenor
);
router.post("/deleteConvenor", checkRole(["admin"]), deleteConvenor);




export default router;

