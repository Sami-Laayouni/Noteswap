// middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate requests using JWT.
 *
 * @param {Function} handler - The next handler function to call if authentication is successful.
 * @returns {Function} A function that takes req and res objects, verifies the JWT token, and calls the handler if the token is valid.
 *
 * @throws {Error} If the token is missing or invalid, responds with a 401 status and an error message.
 */
export const authenticate = (handler) => async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    req.userId = decoded.id;
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
