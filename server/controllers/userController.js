import { validationResult } from "express-validator";
import User from "../models/User.js";

//@desc     register student for an event
//@route    POST /user/registerStudent
//@access   public
export const registerStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      mobileNo,
      email,
      regNo,
      semester,
      course,
      department,
      event,
      type,
    } = req.body;

    //check if student already registered for the given event
    const user = await User.find({
      $or: [{ regNo: regNo }, { email: email }],
      event: { $elemMatch: { id: event.id } },
    });

    //return error if student already registered
    if (user.length > 0) {
      return res
        .status(400)
        .json({ msg: "You Have Already Registered for this event!" });
    }

    //create new user
    const newUser = new User({
      name,
      regNo,
      phoneNo: mobileNo,
      email,
      semester,
      course,
      department,
      event,
      type,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

