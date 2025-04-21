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
//@desc     logout user
//@route    POST /admin/logout
//@access   Public
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "User Logged Out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//@desc     add a new convenor
//@route    POST /admin/addConvenor
//@access   private {admin}
export const addConvenor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, committeeId, committeeName, mobile } =
      req.body;
    const lcEmail = email.toLowerCase();
    const user = await Admin.findOne({ email: lcEmail });
    if (user) {
      res.status(409).json({ error: "Email already exits" });
    } else {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      let existingConvenor = await Admin.findOne({role:"convenor",committeeId});
      if (existingConvenor) {

        // change convenor
        existingConvenor.name= name;
        existingConvenor.email= email;
        existingConvenor.password= password;
        existingConvenor.mobile=mobile;

        const filterCommittee = { _id: committeeId };
        const updateCommittee = {
          convenorName: existingConvenor.name,
          convenorId: existingConvenor._id,
        };
        const updatedCommittee = await Committee.findOneAndUpdate(
          filterCommittee,
          updateCommittee,
          { new: true }
        );
        res.status(201).json({ updatedConvenor:existingConvenor, updatedCommittee });
      } else {
        const newConvenor = new Admin({
          email: lcEmail,
          password: passwordHash,
          name,
          role:"convenor",
          committeeName,
          committeeId,
          mobile,
        });
        const savedConvenor = await newConvenor.save();
        const filter = { _id: committeeId };
        const update = {
          convenorName: savedConvenor.name,
          convenorId: savedConvenor._id,
        };
        const updatedCommittee = await Committee.findOneAndUpdate(
          filter,
          update,
          { new: true }
        );
        res.status(201).json({ savedConvenor, updatedCommittee });
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

//@desc     get list of convenors
//@route    GET /admin/convenors
//@access   private {admin}
export const getConvenors = async (req, res) => {
  try {
    const convenors = await Admin.find({ role: "convenor" }).select(
      "-password"
    );
    res.status(200).json(convenors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//@desc     delete a  convenor
//@route    POST /admin/deleteConvenor
//@access   private {admin}
export const deleteConvenor = async (req, res) => {
  try {
    const { convenorId, committeeId } = req.body;
    const deletedConvenor = await Admin.deleteOne({ _id: convenorId });
    if (deletedConvenor) {
      const filter = { _id: committeeId };
      const update = { convenorName: "-", convenorId: "-" };
      const updatedCommittee = await Committee.findOneAndUpdate(
        filter,
        update,
        { new: true }
      );
      res.status(201).json({ msg: "Deleted Successfully" });
    } else {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, msg: error.message });
  }
};

