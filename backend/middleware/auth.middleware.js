import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
import userModel from "../models/user.model.js";

export const authUser = async (req, res, next) => {
    try {
        // Check if token exists in cookies or headers
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Extract token from Bearer format
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // Check if token is blacklisted
        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been invalidated" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user from database
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Error:", error.message);
        res.status(401).json({ message: "Unauthorized user" });
    }
}