const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userEmail: String,
  role: String, // student / recruiter
  messages: [
    {
      sender: String, // user / bot
      text: String,
      time: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("ChatHistory", chatSchema);
