/* This file conatins the app wide component used to store if the user is logged in or not */

// Import from React
import { createContext, useState } from "react";

// Create new context
const AuthContext = createContext();

// Export the Auth Provider (wraps the entire app)
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false); // Stores whether or not the user is logged in
  const [errorLogin, setErrorLogin] = useState(""); // Stores error messages that appear when using OAUTH2 to login
  const [errorSignup, setErrorSignup] = useState(""); // Stores error messages that appear when using OAUTH2 to signup

  // Return the JSX
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: [loggedIn, setLoggedIn],
        errorLogin: [errorLogin, setErrorLogin],
        errorSignup: [errorSignup, setErrorSignup],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
// End of the context
