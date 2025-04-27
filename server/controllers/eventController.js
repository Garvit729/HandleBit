import moment from "moment";

import Admin from "../models/Admin.js";
import Event from "../models/Event.js";



import { validationResult } from "express-validator";


//@desc     get a single event
//@route    POST /events/getEvent
//@access   public
export const getEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findOne({ _id: eventId });
    if (!event) return res.status(404).json({ msg: "No Event Found " });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//@desc     get a list of all unApproved events
//@route    GET /events/unapprovedEvents
//@access   private {admin}
export const getUnApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: "false" });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//@desc     get a list of all unApproved events of a committee
//@route    POST /events/committeeUnapprovedEvents
//@access   private {convenor, member}
export const getCommitteeUnApprovedEvents = async (req, res) => {
  try {
    const { committeeId } = req.body;
    const events = await Event.find({
      isApproved: false,
      "committee.id": committeeId,
    });
    const sortedEvents = events.sort(
      (a, b) => moment(new Date(b.startDate)) - moment(new Date(a.startDate))
    );
    if (!events) res.status(401).json({ error: "No Events found" });
    res.status(200).json(sortedEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//@desc     get a list of all published events
//@route    GET /events/publishedEvents
//@access   public
export const getPublishedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublished: "true" });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//@desc     get a list of all approved events
//@route    GET /events/approvedEvents
//@access   private {admin}
export const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: "true" });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//@desc     get a list of all approved events of a committee
//@route    POST /events/committeeApprovedEvents
//@access   private {convenor, member}
export const getCommitteeApprovedEvents = async (req, res) => {
  try {
    const { committeeId } = req.body;
    const events = await Event.find({
      isApproved: true,
      "committee.id": committeeId,
    });
    const sortedEvents = events.sort(
      (a, b) => moment(new Date(b.startDate)) - moment(new Date(a.startDate))
    );
    if (!events) res.status(401).json({ error: "No Events found" });
    res.status(200).json(sortedEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//@desc     approve an event
//@route    POST /events/approveEvent
//@access   private {admin}
// approve event will come here 

//@desc     toggle whether an event should be published or not
//@route    POST /events/togglePublish
//@access   private {admin}
export const togglePublish = async (req, res) => {
  try {
    const { id, isPublished } = req.body;
    const filter = { _id: id };
    const update = { isPublished: !isPublished };
    const updatedEvent = await Event.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(201).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};