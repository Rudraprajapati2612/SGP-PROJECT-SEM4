require("dotenv").config();
const { Router } = require("express");
const adminRouter = Router();
const { adminModel,  userModel, RoomModel,MenuModel,ComplaintModel,LightBillModel } = require("../db");
const { z } = require("zod");
// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/adminMid");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { text } = require("stream/consumers");
const { console } = require("inspector");
// api for sign up
adminRouter.post("/Signup", async function (req, res) {
  const requireBody = z.object({
    firstName: z.string(),  // Change to match frontend
    lastName: z.string(),
    email: z.string().email().max(100),
    password: z.string().min(5).max(30),
});
//  check for data vaildation 
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
// api for login 
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
// hash a password and assign jwt token
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


//  Student Registration with Room Allocation
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
  let { date, MealType, MenuItem } = req.body;

  // Ensure values exist before using trim()
  date = typeof date === "string" ? date.trim().replace(/,$/, "") : date;
  MealType = typeof MealType === "string" ? MealType.trim().replace(/,$/, "") : MealType;
  MenuItem = typeof MenuItem === "string" ? MenuItem.trim().replace(/,$/, "") : MenuItem;

  if (!date || !MealType || !MenuItem) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      const updatedMenu = await MenuModel.findOneAndUpdate(
          { date, MealType },  
          { MenuItem },        
          { new: true, upsert: true } 
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



adminRouter.get("/GetComplaints", adminMiddleware, async function (req, res) {
  try {
    const complaints = await ComplaintModel.find().populate("roomNumber");

    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found" });
    }

    res.status(200).json({
      message: "Complaints retrieved successfully",
      complaints,
    });
  } catch (error) {
    console.error("Error Fetching Complaints:", error);
    res.status(500).json({
      message: "Error Fetching Complaints",
      error: error.message,
    });
  }
});


adminRouter.put("/ResolveComplaint/:complaintId", adminMiddleware, async (req, res) => {
  try {
    const { complaintId } = req.params;
    const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
      complaintId,
      { status: "Approved" },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint resolved successfully", updatedComplaint });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



adminRouter.post("/AddLightBill", adminMiddleware, async (req, res) => {
  const { roomNumber, Month, PreviousUnits, CurrentUnits, rate = 11 } = req.body;
  try {
    if (!roomNumber || !Month || PreviousUnits === undefined || CurrentUnits === undefined) {
      return res.status(400).json({ message: "All fields (roomNumber, Month, PreviousUnits, CurrentUnits) are required" });
    }

    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!monthRegex.test(Month)) {
      return res.status(400).json({ message: "Month must be in YYYY-MM format (e.g., 2025-04)" });
    }
// existing light bill check
    const existingBill = await LightBillModel.findOne({ roomNumber, Month });
    if (existingBill) {
      return res.status(400).json({ message: "Bill already exists for this room and month" });
    }

    const previousBill = await LightBillModel.findOne({ roomNumber }).sort({ Month: -1 });
    let validatedPreviousUnits = PreviousUnits;
    if (previousBill) {
      validatedPreviousUnits = previousBill.CurrentUnits;
      if (Month <= previousBill.Month) {
        return res.status(400).json({ message: "Cannot add bill for a month earlier than or equal to the latest existing bill" });
      }
    }

    if (CurrentUnits <= validatedPreviousUnits) {
      return res.status(400).json({ message: "CurrentUnits must be greater than PreviousUnits" });
    }

    const UnitConsumed = CurrentUnits - validatedPreviousUnits;
    const BillAmount = UnitConsumed * rate;

    const NewLightBill = new LightBillModel({
      roomNumber,
      Month,
      PreviousUnits: validatedPreviousUnits,
      CurrentUnits,
      UnitConsumed,
      BillAmount,
      rate,
      createdAt: new Date()
    });

    await NewLightBill.save();
    res.status(201).json({ message: "Bill added successfully", bill: NewLightBill });
  } catch (error) {
    console.error("Error adding bill:", error);
    res.status(500).json({ error: "Error adding bill" });
  }
});

adminRouter.get("/AddLightBill", adminMiddleware, async (req, res) => {
  const { roomNumber } = req.query;
  try {
    if (roomNumber) {
      const previousBill = await LightBillModel.findOne({ roomNumber }).sort({ Month: -1 });
      res.status(200).json({ previousBill });
    } else {
      const bills = await LightBillModel.find();
      res.status(200).json({ bills });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching bills" });
  }
});



module.exports = {
  adminRouter: adminRouter,
};