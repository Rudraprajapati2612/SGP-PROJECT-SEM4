require("dotenv").config();
const { Router } = require("express");
const adminRouter = Router();
const { adminModel, userDetailModel, userModel, RoomModel,MenuModel } = require("../db");
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
    firstName: z.string(),  // Change to match frontend
    lastName: z.string(),
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

  const { firstName, lastName, email, password } = parsedDataWithSuccess.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
   

await adminModel.create({
    Firstname: firstName,  // Convert to match DB field if needed
    Lastname: lastName,
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


adminRouter.post("/add-room", adminMiddleware, async (req, res) => {
  const { roomNumber, capacity } = req.body;

  if (!roomNumber || !capacity) {
    return res.status(400).json({ message: "Room number and capacity are required" });
  }

  try {
    // Check if the room already exists
    const existingRoom = await RoomModel.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    // Create new room
    const newRoom = new RoomModel({
      roomNumber,
      capacity,
      assignedStudents: [],
      isFull: false,
    });

    await newRoom.save();

    res.status(201).json({ message: "Room added successfully", room: newRoom });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ message: "Error adding room", error: error.message });
  }
});

// ✅ Fetch Available Rooms with Capacity & Availability
adminRouter.get("/available-rooms", async (req, res) => {
  try {
    const availableRooms = await RoomModel.find().select("roomNumber capacity assignedStudents isFull");

    const roomWithAvailability = availableRooms.map(room => {
      const occupied = room.assignedStudents.length;
      const available = room.capacity - occupied;

      // Determine room status dynamically
      let status;
      if (available === 0) {
        status = "Full"; // Room is fully occupied
      } else if (available < room.capacity) {
        status = "Partially Occupied"; // Some slots are filled
      } else {
        status = "Vacant"; // No one is assigned
      }

      return {
        roomNumber: room.roomNumber,
        capacity: room.capacity,
        occupied: occupied,
        available: available,
        isFull: available === 0, // Update isFull dynamically if needed
        status: status,
      };
    });

    res.status(200).json({ rooms: roomWithAvailability });
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    res.status(500).json({ message: "Error fetching available rooms" });
  }
});


// ✅ Student Registration with Room Allocation
adminRouter.post("/StudentReg", adminMiddleware, async function (req, res) {
  const { email, Name, roomNumber } = req.body;
  if (!email || !Name || !roomNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 🔹 Check if Student Already Exists
    const activeUser = await userModel.findOne({ email });
    if (activeUser) {
      return res.status(400).json({ message: "Student Already Registered" });
    }

    // 🔹 Fetch Room Details
    const room = await RoomModel.findOne({ roomNumber });

    if (!room) {
      return res.status(400).json({ message: "Room not Found" });
    }

    // 🔴 Check if the Room is Full Before Assigning
    if (room.assignedStudents.length >= room.capacity) {
      return res.status(400).json({ message: "Selected room is full" });
    }

    // 🔹 Generate a Secure Random Password
    const randomPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // 🔹 Create Student Account
    const newUser = await userModel.create({
      Name,
      email,
      password: hashedPassword,
      roomNumber,
    });

    // 🔹 Assign Room to Student
    room.assignedStudents.push(newUser._id);
    
    // ✅ Mark the Room as Full If Necessary
    if (room.assignedStudents.length >= room.capacity) {
      room.isFull = true;
    }

    await room.save();

    // ✅ Send Email with Credentials
    const transport = nodemailer.createTransport({
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
      text: `Hello ${Name},\n\nYour account has been created successfully.\n\nLogin Credentials:\nEmail: ${email}\nPassword: ${randomPassword}\n\nYour assigned room number is: ${roomNumber}\n\nPlease log in and update your profile.\n\nRegards,\nHostel Management Team`,
    };

    await transport.sendMail(mailOptions);

    res.status(201).json({
      message: "Student Registered Successfully, Credentials Sent Via Email!",
      student: newUser,
    });

  } catch (error) {
    console.error("Error Adding Student:", error);
    res.status(500).json({ message: "Error Adding Student", error: error.message });
  }
});

adminRouter.put("/UpdateMenu", adminMiddleware, async function (req, res) {
  const { date, MealType, MenuItem } = req.body;

  if (!date || !MealType || !MenuItem) {
    return res.status(400).json({ message: "All fields are required" });
}


  try {
      const updatedMenu = await MenuModel.findOneAndUpdate(
          { date, MealType },  // Find by date & meal type
          { MenuItem },         // Update menu items
          { new: true, upsert: true } // Return updated doc, create if not found
      );

      res.status(200).json({
          message: "Menu Updated Successfully",
          menu: updatedMenu
      });
  } catch (error) {
      console.error("Error Updating Menu:", error);
      res.status(500).json({ message: "Error Updating Menu", error: error.message });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
