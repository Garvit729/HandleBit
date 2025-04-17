import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import Admin from "../models/Admin.js";

import generateToken from "../utils/generateToken.js";

//@desc     login user
//@route    POST /admin/login
//@access   Public
export const verifyAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lcEmail = email.toLowerCase();
    let admin = await Admin.findOne({ email: lcEmail });
    if (!admin) return res.status(400).json({ msg: "Admin not exists." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials. " });
    admin.password=undefined;
    generateToken(req,res, admin._id);
    res.status(201).json({ user:admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

