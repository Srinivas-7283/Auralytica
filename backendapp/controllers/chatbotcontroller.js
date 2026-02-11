const axios = require("axios");
const fs = require("fs");
const pdf = require("pdf-parse");
const PDFDocument = require("pdfkit");

const ChatHistory = require("../models/ChatHistory");
const JobApplicant = require("../models/JobApplicant");

/* ===============================
   1️⃣ NORMAL CHAT (NO RESUME)
================================ */
const chatWithAI = async (req, res) => {
  try {
    const { message, userEmail, role } = req.body;

    // ✅ Validation
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OpenAI API key is missing!");
      return res.status(500).json({ error: "AI service not configured" });
    }

    // ✅ Build messages array
    const messages = [
      {
        role: "system",
        content:
          "You are a strict technical interview coach. Give role-specific, practical interview questions and answers. Do not give generic responses."
      },
      {
        role: "user",
        content: message
      }
    ];

    console.log("🔵 Sending request to OpenAI...");

    // ✅ Call OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.8,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // ✅ Save chat history (if user is logged in)
    if (userEmail && role) {
      let chatHistory = await ChatHistory.findOne({ userEmail, role });

      if (!chatHistory) {
        chatHistory = new ChatHistory({
          userEmail,
          role,
          messages: []
        });
      }

      chatHistory.messages.push(
        { sender: "user", text: message, timestamp: new Date() },
        { sender: "bot", text: aiReply, timestamp: new Date() }
      );

      await chatHistory.save();
    }

    console.log("✅ AI Response sent successfully");

    res.json({
      reply: aiReply
    });

  } catch (err) {
    console.error("❌ Error in chatWithAI:", err.message);
    
    if (err.response) {
      console.error("OpenAI API Error:", err.response.data);
      return res.status(err.response.status).json({
        error: err.response.data.error?.message || "OpenAI API error"
      });
    }

    res.status(500).json({ error: "AI service failed" });
  }
};

/* =========================================
   2️⃣ CHAT WITH RESUME CONTEXT - UPDATED ✅
========================================= */
const askAIWithResume = async (req, res) => {
  try {
    const { question, userEmail, role } = req.body;
    const resumeFile = req.file; // ✅ Multer provides this

    // ✅ Validation
    if (!resumeFile) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "AI service not configured" });
    }

    const filePath = resumeFile.path;

    // ✅ Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Resume file not found on server" });
    }

    console.log("📄 Reading resume from:", filePath);

    const buffer = fs.readFileSync(filePath);
    const pdfData = await pdf(buffer);

    const resumeText = pdfData.text.substring(0, 3000);

    const prompt = `
You are an interview coach analyzing a candidate's resume.

Candidate Resume:
${resumeText}

Question:
${question}

Provide helpful, specific interview-oriented guidance based on this resume.
`;

    console.log("🔵 Sending resume-based query to OpenAI...");

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiAnswer = response.data.choices[0].message.content;

    // ✅ Save to chat history
    if (userEmail && role) {
      let chatHistory = await ChatHistory.findOne({ userEmail, role });

      if (!chatHistory) {
        chatHistory = new ChatHistory({
          userEmail,
          role,
          messages: []
        });
      }

      chatHistory.messages.push(
        { sender: "user", text: question, timestamp: new Date() },
        { sender: "bot", text: aiAnswer, timestamp: new Date() }
      );

      await chatHistory.save();
    }

    // ✅ Clean up uploaded file after processing
    try {
      fs.unlinkSync(filePath);
      console.log("🗑️ Resume file deleted:", filePath);
    } catch (unlinkErr) {
      console.error("⚠️ Failed to delete resume file:", unlinkErr.message);
    }

    console.log("✅ Resume-based response sent successfully");

    res.json({ answer: aiAnswer });

  } catch (err) {
    console.error("❌ Error in askAIWithResume:", err.message);

    if (err.response) {
      console.error("OpenAI API Error:", err.response.data);
      return res.status(err.response.status).json({
        error: err.response.data.error?.message || "OpenAI API error"
      });
    }

    res.status(500).json({ error: "AI failed to respond" });
  }
};

/* =========================================
   3️⃣ GENERATE PDF FROM QUESTIONS
========================================= */
const generateQuestionsPDF = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Questions array is required" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Interview_Questions.pdf"
    );

    doc.pipe(res);
    doc.fontSize(18).text("Interview Questions\n\n");

    questions.forEach((q, i) => {
      doc.fontSize(12).text(`${i + 1}. ${q}\n\n`);
    });

    doc.end();
  } catch (err) {
    console.error("❌ PDF generation error:", err.message);
    res.status(500).json({ error: "PDF generation failed" });
  }
};

/* =========================================
   4️⃣ GET CHAT HISTORY
========================================= */
const getChatHistory = async (req, res) => {
  try {
    const { userEmail, role } = req.query;

    if (!userEmail || !role) {
      return res.status(400).json({ error: "userEmail and role are required" });
    }

    const history = await ChatHistory.findOne({ userEmail, role });

    if (!history) {
      return res.json({ messages: [] });
    }

    res.json({ messages: history.messages });
  } catch (err) {
    console.error("❌ Error fetching chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

/* ✅ SINGLE EXPORT */
module.exports = {
  chatWithAI,
  askAIWithResume,
  generateQuestionsPDF,
  getChatHistory
};