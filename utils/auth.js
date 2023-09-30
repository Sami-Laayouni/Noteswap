/* Util used to return a true/false depending if the user is logged in or not*/


import jwt from "jsonwebtoken";

export const isAuthenticated = () => {
  const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
      return !!decoded; // Return true if decoded exists, false otherwise
    } catch (error) {
      localStorage.removeItem("token");
      return false;
    }
  };

  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  } else {
    try {
      const decodedToken = verifyToken(token);
      return true;
    } catch (error) {
      localStorage.removeItem("token");
      return false;
    }
  }
};
