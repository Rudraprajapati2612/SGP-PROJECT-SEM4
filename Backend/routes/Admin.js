require("dotenv").config();
const { Router } = require("express");
const adminRouter = Router();
const { adminModel, userDetailModel, userModel, RoomModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/adminMid");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { text } = require("stream/consumers");
const { console } = require("inspector");

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


adminRouter.get("/available-rooms", async (req, res) => { 
  try{
    const availableRooms = await RoomModel.find().select("roomNumber capacity assignedStudents");

    const roomWithAvailibility = availableRooms.map(room=>({
      roomNumber : room.roomNumber,
      capacity : room.capacity,
      occupied : room.assignedStudents.length,
      available : room.capacity - room.assignedStudents.length,
    }));
    res.status(200).json({ rooms: roomWithAvailibility });
  }catch(e){
    console.error("Error fetching available rooms:", error);
    res.status(500).json({ message: "Error fetching available rooms" });
  }
 });


adminRouter.post("/StudentReg", adminMiddleware, async function (req, res) {
  const { email, Name, roomNumber } = req.body;
  if (!email || !Name || !roomNumber) {
    return res.status(400).json({ message: "All fields Are Require" });
  }

  try {
    const activeUser = await userModel.findOne({ email });
    if (activeUser) {
      return res.status(400).json({ message: "Student Already Registered " });
    }
    const room = await RoomModel.findOne({ roomNumber });

    if (!room) {
      return res.status(400).json({ message: "Room  not Found " });
    }

    const randompassword = crypto.randomBytes(4).toString("hex");

    const hashedPassword = await bcrypt.hash(randompassword, 10);

    const newUser = await userModel.create({
      Name,
      email,
      password: hashedPassword,
      roomNumber,
    });
    // assign room to student
    room.assignedStudents.push(newUser._id);
    await room.save();

    // send email with cred

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Hostel Management System Credentials",
      text: `Hello ${Name},\n\nYour account has been created successfully.\n\nLogin Credentials:\nEmail: ${email}\nPassword: ${randomPassword}\n\nYour assigned room number is: ${roomNumber}\n\nPlease log in and update your profile.\n\nRegards,\nHostel Management Team`,
    };
    await transport.sendMail(mailOption);
    res.status(201).json({
      message:"Student Register Successfully, Credentials Sent Via email!",
      student :newUser,
    });
  } catch (error) {
    console.error("Error Adding Student",error);
    res.status(500).json({message:"Error Adding Student",
      error :error.message
    });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
