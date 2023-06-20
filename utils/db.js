import { connect, disconnect } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

/**
 * Establishes a connection to the MongoDB database.
 * @returns {Promise<void>} - Promise that resolves once the connection is established.
 */
export const connectDB = async () => {
  if (isConnected) {
    // If already connected, return the existing connection
    return;
  }

  try {
    // Connect to MongoDB

    await connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

/**
 * Closes the connection to the MongoDB database.
 * @returns {Promise<void>} - Promise that resolves once the connection is closed.
 */
export const disconnectDB = async () => {
  if (!isConnected) {
    // If not connected, return
    return;
  }

  try {
    // Close the MongoDB connection
    await disconnect();

    isConnected = false;
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection failed", error);
    throw error;
  }
};
