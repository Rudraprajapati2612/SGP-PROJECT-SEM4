const e = require("express");
const mongoose = require("mongoose");
const { number, string, union } = require("zod");
const Schema = mongoose.Schema;

const objectId = Schema.ObjectId;

const UserSchema = new Schema({
  Name: String,
  email: { type: String, unique: true },
  password: String,
  roomNumber : {type:Number ,require:true},
  isProfileUpdated: { type: Boolean, default: false },
});

const AdminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  Firstname: String,
  Lastname: String,
});


const UserDetailsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "UserCred", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  bloodGroup: String,
  contactNumber: { type: String, required: true },
  parentsContact: { type: String, required: true },
  guardianContact: String,
  emergencyContact: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  course: String,
  semester: String,
  roomNumber: { type: Number },
  // dateOfAdmission: String,
  Email: { type: String, unique: true },
  
});

const MenuSchema = new Schema({
  date:{type:String,require:true},
  MealType :{type:String,require:true},
  MenuItem :{type:String ,require:true}
})
const RoomSchema = new Schema({
  roomNumber : {type:Number,require:true,unique:true},
  capacity:{type:Number,require:true},
  assignedStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isFull: { type: Boolean, default: false },
  // Status :{type:string}
})
  const ComplaintSchema = new Schema({
    Subject:{type:String,require:true},
    roomNumber:{type:String,require:true},
    complaintDate:{type:String,require:true},
    Description:{type:String,require:true}
  })

  const LightBillSchema = new mongoose.Schema({
    roomNumber: { type: Number, required: true },  // ✅ Fixed 'Number'
    Month: { type: String, required: true },  // ✅ Fixed 'String'
    PreviousUnits: { type: Number, required: true },
    CurrentUnits: { type: Number, required: true },
    UnitConsumed: { type: Number },
    BillAmount: { type: Number }
});

  const AnnouncementSchema = new Schema ({
    AnnouncementTitle : {type :String,require :true},
    AnnouncementDate : {type :String,require :true},
    Description : {type :String,require :true}
  });

const userModel = mongoose.model("UserCred", UserSchema);
const adminModel = mongoose.model("AdminCred", AdminSchema);
const userDetailModel = mongoose.model("UserDetails", UserDetailsSchema);
const RoomModel = mongoose.model("RoomDetails",RoomSchema);
const MenuModel = mongoose.model("Menu",MenuSchema);
const ComplaintModel = mongoose.model("Complain",ComplaintSchema);
const LightBillModel = mongoose.model("LightBill",LightBillSchema);
module.exports = {
  userModel,
  adminModel,
  userDetailModel,
  RoomModel,
  MenuModel,
  ComplaintModel,
  LightBillModel
};