import { createContext, useState } from "react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  return (
    <SocketContext.Provider
      value={{
        socketIs: [socket, setSocket],
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export default SocketContext;
