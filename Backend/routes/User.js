const { Router }= require("express");
const userRouter = Router();
const {z}= require("zod");
const {userModel, userDetailModel} = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD }=require("../config");


userRouter.post("/Login", async function(req,res){
  const email = req.body.email;
  const password = req.body.password;

  const response = await userModel.findOne({
    email : email
  })

  if(!response){
    res.json({
      message : "User Not Found In Database "
    });
    return
  }
  
  const passwordMatched = await bcrypt.compare(password,response.password);
  if(passwordMatched){
    const token = jwt.sign({
      id : response._id.toString(),
    },JWT_USER_PASSWORD
  );
  res.json({
    token
  });
  }else{
    res.status(403).json({
      message: "Invalid Creds",
    });
  }
})

module.exports={
    userRouter : userRouter
}


