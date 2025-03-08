const { Router }= require("express");
const userRouter = Router();
const {z}= require("zod");
const {userModel, userDetailModel} = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD }=require("../config");


userRouter.post("/Login", async function(req,res){
  const email = req.body.email;
  const password = req.body.password;

  const response = await userModel.findOne({
    email : email
  })

  if(!response){
    res.json({
      message : "User Not Found In Database "
    });
    return
  }
  
  const passwordMatched = await bcrypt.compare(password,response.password);
  if(passwordMatched){
    const token = jwt.sign({
      id : response._id.toString(),
    },JWT_USER_PASSWORD
  );
  res.json({
    token
  });
  }else{
    res.status(403).json({
      message: "Invalid Creds",
    });
  }
})


userRouter.put("/updateProfile", async function (req, res) {
  const { userId, firstName, lastName, dateOfBirth, bloodGroup, contactNumber, parentsContact, guardianContact, emergencyContact, address, city, state, course, semester } = req.body;

  try {
    // 🔹 Fetch user details (Name, Email, Room Number) from `userModel`
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // 🔹 Prepare the update object dynamically
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
      roomNumber: user.roomNumber, // Ensure roomNumber is from userModel
      email : user.email
    };

    // 🔹 Only add `email` if it's not null
    if (user.email) {
      updateData.email = user.email;
    }

    // 🔹 Update or insert user details
    const userDetails = await userDetailModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Profile updated successfully", userDetails });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

module.exports={
    userRouter : userRouter
}


