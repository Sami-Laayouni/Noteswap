/* This file conatins the app wide component used to handle the websockets using socket.io */

// Import from React
import { createContext, useContext, useState, useEffect } from "react";
// Import from Socket.IO
import io from "socket.io-client";
// Import from NEXTJS
import { useRouter } from "next/router";

//Create a new context
const SocketContext = createContext();

// Import a function to useSocket
export function useSocket() {
  return useContext(SocketContext);
}

function parseQueryString(queryString) {
  const keyValuePairs = queryString.split("&");
  const result = {};

  keyValuePairs.forEach((keyValuePair) => {
    const [key, value] = keyValuePair.split("=");
    result[key] = value;
  });

  return result;
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const router = useRouter();

  const server = "https://noteswap.onrender.com"; // Sever that hosts the socket (beacause VERCEL doesn't)

  useEffect(() => {
    if (router.pathname.includes("connect")) {
      const { query } = router;

      if (query.id) {
        const { tutoringSessionId } = parseQueryString(query.id);
        if (tutoringSessionId) {
          try {
            // Intialize the socket
            const newSocket = io(server, {
              path: "/socket.io",
              query: `id=${tutoringSessionId}`,
              transports: ["websocket", "polling"],
              secure: true,
            });
            setSocket(newSocket);
            return () => newSocket.close();
          } catch (err) {
            // Catch an error
            console.log(err);
          }
        } else {
          try {
            const newSocket = io(server, {
              path: "/socket.io",
              query: `id=${query.id}`,
              transports: ["websocket", "polling"],
              secure: false,
            });
            setSocket(newSocket);
            return () => newSocket.close();
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }, [router]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export default SocketContext;
// End of the SocketContext
