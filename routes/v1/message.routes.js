import express from "express";
import { getMessages } from "../../modules/message/messageController.js";

const router = express.Router();
// router.get("/messages/:roomId", async (req, res) => {
//   try {
//     const messages = await Message.find({
//       roomId: req.params.roomId,
//     }).sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch messages" });
//   }
// });

router.get("/:user1/:user2", getMessages);

export default router;
