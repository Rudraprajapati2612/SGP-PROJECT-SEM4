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
    Age: { type: Number, required: true },
    Email: { type: String, unique: true, required: true },
    DOB : { type: String, unique: true, required: true },
    StudentContactNo : { type: Number, unique: true, required: true },
    MotherContactNo : { type: Number, unique: true, required: true },
    FatherContactNo : { type: Number, unique: true, required: true },
    Address : { type: String, unique: true, required: true },
    DateOfAdmission : { type: String, unique: true, required: true },
    HostelName : { type: String, unique: true, required: true },
    AadharNumber : { type: Number, unique: true, required: true },
    CollageName : { type: String, unique: true, required: true },
    RoomNumber : { type: Number, unique: true, required: true },
  });
  const userModel = mongoose.model("user",UserSchema);
  const adminModel = mongoose.model("admin",AdminSchema);
  const userDetailModel = mongoose.model("UserDetails",UserDetailsSchema);
  module.exports = {
    userModel,
    adminModel,
    userDetailModel
  }