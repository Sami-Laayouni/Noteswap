import { Server as ServerIO } from "socket.io";

/**
 * Let Io
 * @date 8/13/2023 - 4:42:11 PM
 *
 * @type {*}
 */
let io;

/**
 * Get the socket server
 * @date 8/13/2023 - 4:42:11 PM
 *
 * @export
 * @param {*} httpServer
 * @return {*}
 */
export function getSocketServer(httpServer) {
  if (!io) {
    io = new ServerIO(httpServer, {
      path: "/api/socket.io",
      cors: {
        origin: process.env.NEXT_PUBLIC_URL,
        methods: ["GET", "POST"],
      },
    });
  }
  return io;
}
