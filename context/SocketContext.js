import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useRouter } from "next/router";

const SocketContext = createContext();

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

  const server = "https://noteswap.onrender.com";

  useEffect(() => {
    if (router.pathname.includes("connect")) {
      const { query } = router;

      if (query.id) {
        const { tutoringSessionId } = parseQueryString(query.id);
        if (tutoringSessionId) {
          try {
            const newSocket = io(server, {
              path: "/socket.io",
              query: `id=${tutoringSessionId}`,
              transports: ["websocket", "polling"],
              secure: true,
            });
            setSocket(newSocket);
            return () => newSocket.close();
          } catch (err) {
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
