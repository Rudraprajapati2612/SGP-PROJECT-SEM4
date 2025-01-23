const { Router }= require("express");
const userRouter = Router();
const {z}= require("zod");
const {userModel, userDetailModel} = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD }=require("../config");


userRouter.post("/Signup", async function(req,res){
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
          error: parsedDataWithSuccess.error.errors, // Provide detailed validation errors
        });
      }
    
      const { Firstname, Lastname, email, password } = parsedDataWithSuccess.data;

      const userExists = await userDetailModel.findOne({ Email: email });

  if (!userExists) {
    return res.status(403).json({
      message: "User not authorized to register. Please contact admin.",
    });
  }
      const hashedPassword = await bcrypt.hash(password, 10);
    
      try {
        await userModel.create({
          Firstname:  Firstname,
          Lastname:  Lastname,
          email:  email,
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


