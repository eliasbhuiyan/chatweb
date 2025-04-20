const express = require("express");
const { createConversation, conversationList } = require("../../controller/conversationController");
const authMiddleware = require("../../middleware/authMiddleware");
const { sendMessage, getMessages } = require("../../controller/messageController");
const router = express.Router();

router.post("/createconversation", authMiddleware , createConversation)
router.get("/conversationlist", authMiddleware , conversationList)

router.post("/send", authMiddleware, sendMessage)
router.get("/getmessage/:conversationid", authMiddleware, getMessages)

module.exports = router;
