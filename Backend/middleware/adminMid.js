// function adminMiddleware(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ // 401 more appropriate than 403
//             message: "Authentication required",
//             error: "No token provided"
//         });
//     }

//     const token = authHeader.split(" ")[1];
    
//     try {
//         const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
//         if (!decoded.role || decoded.role !== 'admin') { // Add role checking
//             return res.status(403).json({
//                 message: "Admin access required"
//             });
//         }
//         req.userId = decoded.id;
//         next();
//     } catch (error) {
//         return res.status(401).json({ // 401 for auth errors
//             message: "Authentication failed",
//             error: error.message
//         });
//     }
// }
// for website 
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization; // Correct header key
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "You are not signed in" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'
    
    try {
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

module.exports = { adminMiddleware };



// /// Checking in postman 
// const jwt = require("jsonwebtoken");
// const { JWT_ADMIN_PASSWORD } = require("../config");
// function adminMiddleware(req,res,next){
//     const token = req.headers.token
//     const decoded = jwt.verify(token,JWT_ADMIN_PASSWORD);
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
//     adminMiddleware : adminMiddleware
// }