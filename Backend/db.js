const e = require("express");
const mongoose = require("mongoose");
const { number, string } = require("zod");
const Schema = mongoose.Schema;

const objectId = Schema.ObjectId;

const UserSchema = new Schema({
  Firstname: String,
  Lastname: String,
  email: { type: String, unique: true },
  password: String,
});

const AdminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  Firstname: String,
  Lastname: String,
});

const UserDetailsSchema = new Schema({
  Firstname: { type: String, required: true },
  Lastname: { type: String, required: true },

  Email: { type: String, unique: true, required: true },

  StudentContactNo: { type: String, unique: true, required: true },
  DateOfAdmission: { type: String, required: true },
  HostelName: { type: String, unique: true, required: true },

  CollageName: { type: String, unique: true, required: true },
  RoomNumber: { type: String, unique: true, required: true },
});
const userModel = mongoose.model("user", UserSchema);
const adminModel = mongoose.model("admin", AdminSchema);
const userDetailModel = mongoose.model("UserDetails", UserDetailsSchema);
module.exports = {
  userModel,
  adminModel,
  userDetailModel,
};
