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



  adminRouter.post("/StudentReg", adminMiddleware, async function (req, res) {
    const { email, Firstname, Lastname } = req.body;
  
    if (!Firstname || !Lastname || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Check if the student already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Student already registered" });
      }
  
      // Generate a random password
      const randomPassword = crypto.randomBytes(4).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
      // Create user in database
      const newUser = await userModel.create({
        Firstname,
        Lastname,
        email,
        password: hashedPassword,
      });
  
      // Create UserDetails with userId
      // const userDetail = new userDetailModel({
      //   userId: newUser._id, // Use the ID of the newly created user
      // });
      // await userDetail.save();
  
      // Send email with credentials
      await newUser.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Hostel Management System Credentials",
        text: `Hello ${Firstname},\n\nYour account has been created successfully.\n\nLogin Credentials:\nEmail: ${email}\nPassword: ${randomPassword}\n\nPlease log in and update your profile.\n\nRegards,\nHostel Management Team`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(201).json({
        message: "Student registered successfully, credentials sent via email!",
        student: userDetail,
      });
  
    } catch (error) {
      console.error("Error adding student:", error);
      res.status(500).json({ message: "Error adding student", error: error.message });
    }
  });



module.exports = {
  adminRouter: adminRouter,
};
