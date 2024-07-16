// middleware/auth.js
import jwt from "jsonwebtoken";

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
