const { Router } = require("express");
const userRouter = Router();
const { z } = require("zod");
const { userModel, userDetailModel,ComplaintModel,RoomModel,MenuModel } = require("../db");
// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const{userMiddleware} = require("../middleware/userMid")




userRouter.post("/Login", async function (req, res) {
  console.log("Request Body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email }); // Changed 'response' to 'user'
    if (!user) {
      return res.status(404).json({ message: "User Not Found In Database" });
    }

    console.log("Plain-text Password from Request:", password);
    console.log("Hashed Password from DB:", user.password);
    console.log("Password Type:", typeof password);
    console.log("Password Length:", password.length);

    if (!user.password) {
      return res.status(500).json({ message: "User password not set in database" });
    }

    const cleanPassword = password.trim();
    if (!cleanPassword) {
      return res.status(400).json({ message: "Password cannot be empty" });
    }

    const passwordMatched = await bcrypt.compare(cleanPassword, user.password);
    if (!passwordMatched) {
      return res.status(403).json({ message: "Invalid Creds" });
    }

    const userDetails = await userDetailModel.findOne({ userId: user._id });
    const profileExists = !!userDetails;

    const token = jwt.sign(
      { id: user._id.toString() },
      JWT_USER_PASSWORD,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      email: user.email,
      roomNumber: user.roomNumber,
      profileExists,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});




userRouter.get("/checkProfile", userMiddleware, async (req, res) => {
  try {
    const userDetails = await userDetailModel.findOne({ userId: req.userId });
    res.status(200).json({
      profileExists: !!userDetails,
      email: userDetails?.Email || (await userModel.findById(req.userId)).email,
      roomNumber: userDetails?.roomNumber || (await userModel.findById(req.userId)).roomNumber
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error checking profile", 
      error: error.message 
    });
  }
});   
// The issue is in your userRouter.put route
// The error shows that MongoDB has an index on "Email" (capital E)
// but your code is using "email" (lowercase e)





userRouter.put("/updateProfile", userMiddleware, async function (req, res) {
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
  } = req.body;

  try {
    // Find the user by ID to get their email and room number
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create update data object
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
      Email: user.email, // Matches the schema
      roomNumber: user.roomNumber,
      dateOfAdmission: user.dateOfAdmission || "N/A", // Fallback if not available
    };

    console.log("User found:", user);
    console.log("Update data:", updateData);

    // Update or create user details document
    const userDetails = await userDetailModel.findOneAndUpdate(
      { userId: user._id },
      { $set: updateData },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      userDetails,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
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





// userRouter.get("/Users", userMiddleware, async (req, res) => {
//   console.log("Received GET request to /api/v1/user/user");
//   try {
//     const user = await userModel.findOne({ _id: req.userId });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({
//       email: user.email,
//       roomNumber: user.roomNumber,
//       // dateOfAdmission: user.dateOfAdmission || "N/A",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching user data", error: error.message });
//   }
// });



userRouter.get("/GetMenu", async (req, res) => {
  const { date, MealType } = req.query;
  console.log("Query Params:", req.query); // Debug: Check incoming params

  if (!date || !MealType) {
    return res.status(400).json({ message: "Date and MealType are required" });
  }

  try {
    // Convert date string to a format that matches your database
    const queryDate = new Date(date);
    console.log("Query Date:", queryDate); // Debug: Check parsed date

    // Adjust query based on whether date is stored as String or Date
    const menu = await MenuModel.findOne({
      date: { $eq: queryDate }, // For Date type
      // date: date, // Uncomment if date is stored as String (e.g., "2025-04-09")
      MealType: MealType
    });

    if (!menu) {
      console.log("No menu found for:", { date, MealType }); // Debug
      return res.status(404).json({ message: "Menu not found for the given date and meal type" });
    }

    console.log("Menu found:", menu); // Debug
    res.status(200).json({ message: "Menu retrieved successfully", menu });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ message: "Error fetching menu", error: error.message });
  }
});


// userRouter.get("/GetMenu", async (req, res) => {
//   const { date, MealType } = req.query;
//   console.log("Query Params:", req.query);
//   // Validate required query params
//   if (!date || !MealType) {
//       return res.status(400).json({ message: "Date and MealType are required" });
//   }

//   try {
//       const menu = await MenuModel.findOne({ date, MealType });
//       if (!menu) {
//           return res.status(404).json({ message: "Menu not found for the given date and meal type" });
//       }
//       res.status(200).json({ message: "Menu retrieved successfully", menu });
//   } catch (error) {
//       res.status(500).json({ message: "Error fetching menu", error: error.message });
//   }
// });



module.exports = {
  userRouter: userRouter,
};