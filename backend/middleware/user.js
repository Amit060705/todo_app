//  start writing from here
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.SECRET;
const authenticateJwt=(req, res, next)=>{
    // Implement user auth logic
    const token=req.headers.authorization; 
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decodedData=jwt.verify(token,JWT_SECRET);
        req.userId=decodedData.id;
        next();
    } catch (error) {
        return res.status(403).json({message:"invalid or expired token"});
    } 
}

module.exports = {
    authenticateJwt,
    JWT_SECRET
};