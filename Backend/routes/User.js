const { Router } = require("express");
const userRouter = Router();
const { z } = require("zod");
const { userModel, userDetailModel,ComplaintModel,RoomModel,MenuModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const{userMiddleware} = require("../middleware/userMid")
userRouter.post("/Login", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const response = await userModel.findOne({
    email: email,
  });

  if (!response) {
    res.json({
      message: "User Not Found In Database ",
    });
    return;
  }

  const passwordMatched = await bcrypt.compare(password, response.password);
  if (passwordMatched) {
    const token = jwt.sign(
      {
        id: response._id.toString(),
      },
      JWT_USER_PASSWORD
    );
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Invalid Creds",
    });
  }
});

userRouter.put("/updateProfile",userMiddleware, async function (req, res) {
  const {
    userId,
    firstName,
    lastName,
    dateOfBirth,
    bloodGroup,
    contactNumber,
    parentsContact,
    guardianContact,
    emergencyContact,
    address,
    city,
    state,
    course,
    semester,
    email
  } = req.body;

  try {
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {
      firstName,
      lastName,
      dateOfBirth,
      bloodGroup,
      contactNumber,
      parentsContact,
      guardianContact,
      emergencyContact,
      address,
      city,
      state,
      course,
      semester,
      roomNumber: user.roomNumber,
      email
      
    };
   console.log(user);
   console.log(updateData);
   


    if (user.email) {
      updateData.email = user.email;
    } 
    console.log(updateData.email);
    
    const userDetails = await userDetailModel.updateOne(
      { userId:user._id },
      { $set: updateData },
      {  upsert: true }
    );
    
    
    res.status(200).json({ message: "Profile updated successfully", userDetails });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});


userRouter.post("/AddComplaint", userMiddleware, async function (req, res) {
  const { Subject, roomNumber, complaintDate, Description } = req.body;

  if (!Subject || !roomNumber || !complaintDate || !Description) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }

  try {
    const room = await RoomModel.findOne({ roomNumber });
    if (!room) {
      return res.status(400).json({ message: "Room not Found" });
    }

    const newComplaint = await ComplaintModel.create({
      Subject,
      roomNumber,
      Description,
      complaintDate
    });

    res.status(201).json({
      message: "Complaint Sent Successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Error Adding Complaint:", error);
    res.status(500).json({
      message: "Error Adding Complaint",
      error: error.message,
    });
  }
});

userRouter.get("/GetMenu", async (req, res) => {
  const { date, MealType } = req.query;
  console.log("Query Params:", req.query);
  // Validate required query params
  if (!date || !MealType) {
      return res.status(400).json({ message: "Date and MealType are required" });
  }

  try {
      const menu = await MenuModel.findOne({ date, MealType });
      if (!menu) {
          return res.status(404).json({ message: "Menu not found for the given date and meal type" });
      }
      res.status(200).json({ message: "Menu retrieved successfully", menu });
  } catch (error) {
      res.status(500).json({ message: "Error fetching menu", error: error.message });
  }
});


module.exports = {
  userRouter: userRouter,
};
