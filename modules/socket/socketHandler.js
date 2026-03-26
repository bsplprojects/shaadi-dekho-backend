import messageModel from "../message/message.model.js";

// userId -> socketId map
const userSocketMap = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      userSocketMap[userId] = socket.id;
      console.log("User registered:", userId, socket.id);
    });

    // Handle sending message
    socket.on("send_message", async (data) => {
      const { senderId, receiverId, text } = data;

      try {
        // Save to DB
        const message = await messageModel.create({
          senderId,
          receiverId,
          text,
        });

        // Send to receiver if online
        const receiverSocketId = userSocketMap[receiverId];

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        // Also send back to sender (for UI sync)
        socket.emit("receive_message", message);
      } catch (err) {
        console.error(err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {

      for (let userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
    });
  });
};

export default socketHandler;
