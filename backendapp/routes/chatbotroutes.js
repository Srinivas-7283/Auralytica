const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  chatWithAI,
  askAIWithResume,
  generateQuestionsPDF,
  getChatHistory
} = require("../controllers/chatbotcontroller");

// ✅ Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ✅ Routes
router.post("/chat", chatWithAI);
router.post("/ask-with-resume", upload.single("resume"), askAIWithResume);
router.post("/generate-questions-pdf", generateQuestionsPDF);
router.get("/chat-history", getChatHistory);

module.exports = router;