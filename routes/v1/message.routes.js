import express from "express";
import {
  getMessages,
  postMessage,
} from "../../modules/message/messageController.js";

const router = express.Router();

router.post("/saveMessages", postMessage);
router.get("/:user1/:user2", getMessages);

export default router;
