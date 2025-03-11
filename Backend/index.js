require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors")
const { userRouter } = require("./routes/User");
const { adminRouter } = require("./routes/Admin");
const app = express();

app.use(cors());

// OR enable CORS for a specific frontend
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials : true
  })
);
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

async function main() {
    // this is here because first we are able to connect to our database 
  await mongoose.connect(process.env.MONGO_URL);

  app.listen(3000);
}

main();