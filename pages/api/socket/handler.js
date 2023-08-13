import { getSocketServer } from "./socketServer";

/**
 * Configuration to disable bodyParser
 * @date 8/13/2023 - 4:41:41 PM
 *
 * @type {{ api: { bodyParser: boolean; }; }}
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Intialize socket handler
 * @date 8/13/2023 - 4:41:41 PM
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export default async function handler(req, res) {
  const io = getSocketServer(res.socket.server);

  // Now you can use the "io" instance to handle socket events or any other functionality
  if (io) {
    io.on("connection", (socket) => {
      // You can add your custom event listeners and handling here
      socket.on("started", (groupId) => {
        socket.to(groupId).emit("start", "Hello from server!");
      });
      socket.on("joinGroup", (groupId) => {
        // Join the room with the provided group ID
        socket.join(groupId);
      });
      socket.on("joined", (groupId) => {
        socket.to(groupId).emit("join", "Hello from server!");
      });
      socket.on("ended", (groupId) => {
        socket.to(groupId).emit("end", "Ended");
      });
    });
  }

  res.end();
}
