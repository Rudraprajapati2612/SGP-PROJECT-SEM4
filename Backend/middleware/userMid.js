const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // fix this: use headers
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "You Are Not Signed In" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = { userMiddleware };

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