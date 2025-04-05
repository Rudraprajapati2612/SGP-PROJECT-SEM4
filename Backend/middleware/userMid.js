const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req, res, next) {
  // Extract token from Authorization header (Bearer <token>)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization header missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

  try {
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);
    if (decoded) {
      req.userId = decoded.userId; // Use userId to match the payload field
      next();
    } else {
      res.status(403).json({
        message: "Invalid token",
      });
    }
    console.log("Decoded token:", decoded);
console.log("Extracted userId:", req.userId);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(403).json({
        message: "Token expired. Please log in again.",
      });
    } else if (error.name === "JsonWebTokenError") {
      res.status(403).json({
        message: "Invalid token",
      });
    } else {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = {
  userMiddleware: userMiddleware,
};
// for postman 

// const jwt = require("jsonwebtoken");
// const { JWT_USER_PASSWORD } = require("../config");
// function userMiddleware(req,res,next){
//     const token = req.headers.token
//     const decoded = jwt.verify(token,JWT_USER_PASSWORD);
//     if(decoded){
//         req.userId = decoded.id;
//         next()
//     }else{
//         res.status(403).json({
//             message : "You Are not sign In "
//         })
//     }
// }

// module.exports = {
//     userMiddleware : userMiddleware
// }