require("dotenv").config();
const { Router } = require("express");
const adminRouter = Router();
const { adminModel, userDetailModel,userModel  } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/adminMid");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

adminRouter.post("/addNewUser", adminMiddleware, async function (req, res) {
  const { Firstname, Lastname, Email, StudentContactNo, DateOfAdmission, HostelName, CollageName, RoomNumber } = req.body;

  if (!Firstname || !Lastname || !Email || !StudentContactNo || !DateOfAdmission || !HostelName || !CollageName || !RoomNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Generate a random password
    const randomPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Save student details
    const userDetail = new userDetailModel({
      Firstname,
      Lastname,
      Email,
      StudentContactNo,
      DateOfAdmission,
      HostelName,
      CollageName,
      RoomNumber,
    });

    await userDetail.save();

    // Save user credentials
    await userModel.create({
      Firstname,
      Lastname,
      email: Email,
      password: hashedPassword,
    });

    // Send email with credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Set these in your .env file
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Email,
      subject: "Your Hostel Management System Credentials",
      text: `Hello ${Firstname},\n\nYour account has been created successfully. Here are your login credentials:\n\nEmail: ${Email}\nPassword: ${randomPassword}\n\n.\n\nRegards,\nHostel Management Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Student added successfully and email sent!", student: userDetail });

  } catch (error) {
    res.status(500).json({ message: "Error adding student", error: error.message });
  }
});

adminRouter.put("/updateStudent/:id", adminMiddleware, async function (req, res) {
  const studentId = req.params.id;

  const updateSchema = z.object({
    Firstname: z.string().optional(),
    Lastname: z.string().optional(),
    Age: z.string().optional(),
    Email: z.string().email().optional(),
    DOB: z.string().optional(),
    StudentContactNo: z.string().optional(),
    MotherContactNo: z.string().optional(),
    FatherContactNo: z.string().optional(),
    Address: z.string().optional(),
    DateOfAdmission: z.string().optional(),
    HostelName: z.string().optional(),
    AadharNumber: z.string().optional(),
    CollageName: z.string().optional(),
    RoomNumber: z.string().optional(),
  });

  const parsedData = updateSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid update data",
      errors: parsedData.error.errors,
    });
  }

  try {
    const updatedStudent = await userDetailModel.findByIdAndUpdate(
      studentId,
      parsedData.data,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student details updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating student details",
      error: error.message,
    });
  }
});


adminRouter.delete("/DeleteStudent/:id", adminMiddleware, async function (req, res) {
  const studentIdDel = req.params.id;
  try{
    const DeleteStudent = await userDetailModel.findByIdAndDelete(studentIdDel);
    if(!DeleteStudent){
      res.status(404).json({
        message : "Student Not Found Or Alredy Deleted"
      })
    }

    res.status(200).json({
      message : "Student Details Delete Suscefully"
    })
  }catch(error){
    console.error(error);
    res.status(500).json({
      message: "Error deleting student details",
      error: error.message,
    });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
