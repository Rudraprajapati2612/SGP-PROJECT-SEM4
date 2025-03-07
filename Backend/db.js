const e = require("express");
const mongoose = require("mongoose");
const { number, string, union } = require("zod");
const Schema = mongoose.Schema;

const objectId = Schema.ObjectId;

const UserSchema = new Schema({
  Name: String,
  email: { type: String, unique: true },
  password: String,
  roomNumber : {type:Number ,require:true}
});

const AdminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  Firstname: String,
  Lastname: String,
});

const UserDetailsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "UserCred", required: true }, // Reference to UserSchema
  roomNumber: { type: Number }, // Optional: Assigned room number
  contactNumber: { type: String }, // Optional: Student phone number
  address: { type: String }, // Optional: Student address
  guardianName: { type: String }, // Optional: Parent/Guardian name
});

const RoomSchema = new Schema({
  roomNumber : {type:Number,require:true,unique:true},
  capacity:{type:Number,require:true},
  assignedStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isFull: { type: Boolean, default: false },
})
const userModel = mongoose.model("UserCred", UserSchema);
const adminModel = mongoose.model("AdminCred", AdminSchema);
const userDetailModel = mongoose.model("UserDetails", UserDetailsSchema);
const RoomModel = mongoose.model("RoomDetails",RoomSchema);
module.exports = {
  userModel,
  adminModel,
  userDetailModel,
  RoomModel
};
