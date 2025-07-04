const express = require("express");
const { createConversation, conversationList } = require("../../controller/conversationController");
const authMiddleware = require("../../middleware/authMiddleware");
const { sendMessage, getMessages } = require("../../controller/messageController");
const upload = require("../../helpers/multer");
const router = express.Router();

router.post("/createconversation", authMiddleware , createConversation)
router.get("/conversationlist", authMiddleware , conversationList)

router.post("/send", authMiddleware, upload.single('content'), sendMessage)
router.get("/getmessage/:conversationid", authMiddleware, getMessages)

module.exports = router;
