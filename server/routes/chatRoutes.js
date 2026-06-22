const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMessages, sendMessage, getConversations } = require("../controllers/chatController");

router.use(protect);

router.get("/conversations", getConversations);
router.get("/:userId", getMessages);
router.post("/", sendMessage);

module.exports = router;
