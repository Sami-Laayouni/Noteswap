import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const [errorSignup, setErrorSignup] = useState("");

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
