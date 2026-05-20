import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Read token from cookies
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized request. Please login"
        });
      }
      // Verify token and decode it
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decodedToken);
      // Check if role is allowed
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "Forbidden. You don't have permission"
        });
      }
      //Attach user Info to req for use in routes
      req.user = decodedToken;

      next();

    } catch (err) {
      // jwt.verify throws if token is invalid/expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired. Please login again"
        });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token"
        });
      }
      next(err);
    }
  };
};