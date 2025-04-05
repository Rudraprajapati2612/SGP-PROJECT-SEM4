require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { userRouter } = require("./routes/User");
const { adminRouter } = require("./routes/Admin");

const app = express();

//  Proper CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5174", // Allow only your frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies & authentication
  })
);

app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

async function main() {
  // Ensure database connection before starting server
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

main();
