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
