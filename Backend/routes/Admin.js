require("dotenv").config();
const { Router } = require("express");
const adminRouter = Router();
const { adminModel, userDetailModel  } = require("../db");


const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/adminMid");
adminRouter.post("/Signup", async function (req, res) {
  const requireBody = z.object({
    Firstname: z.string(),
    Lastname: z.string(),
    email: z.string().email().max(100),
    password: z.string().min(5).max(30),
  });

  const parsedDataWithSuccess = requireBody.safeParse(req.body);
  if (!parsedDataWithSuccess.success) {
    return res.status(400).json({
      message: "Incorrect Format",
      error: parsedDataWithSuccess.error.errors, 
    });
  }

  const { Firstname, Lastname, email, password } = parsedDataWithSuccess.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await adminModel.create({
      Firstname: Firstname,
      Lastname: Lastname,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "Signup Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
});

adminRouter.post("/Login", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const response = await adminModel.findOne({
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
      JWT_ADMIN_PASSWORD
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

adminRouter.post("/addNewUser", adminMiddleware,async function (req, res) {
  const { Firstname, Lastname, Age,Email,DOB,
    StudentContactNo,
    MotherContactNo,
    FatherContactNo,
    Address,
    DateOfAdmission,
    HostelName,
    AadharNumber,
    CollageName,RoomNumber } = req.body;
  if (!Firstname || !Lastname || !Age ||!Email || !StudentContactNo || !MotherContactNo || !FatherContactNo|| !Address||!DateOfAdmission || !DOB ||!HostelName||!AadharNumber||!CollageName||!RoomNumber ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userDetail = new userDetailModel({ Firstname, Age, Lastname, Email, DOB,
      StudentContactNo,
      MotherContactNo,
      FatherContactNo,
      Address,
      DateOfAdmission,
      HostelName,
      AadharNumber,
      CollageName,RoomNumber });
    await userDetail.save();
    res.status(201).json({ message: 'Student added successfully', student: userDetail });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
});
module.exports = {
  adminRouter: adminRouter,
};
