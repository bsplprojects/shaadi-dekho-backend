import messageModel from "./message.model.js";

export const postMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    const message = await messageModel.create({
      senderId,
      receiverId,
      text,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await messageModel
      .find({
        $or: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
