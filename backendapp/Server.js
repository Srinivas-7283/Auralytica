
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express(); // ✅ MUST come before app.use

// MONGODB CONNECTION
const dburl = process.env.mongodburl;

mongoose.connect(dburl)
  .then(() => {
    console.log("Connected to DB Successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

// MIDDLEWARES
app.use(cors());
app.use(express.json());  // parse JSON data

// ✅ MAKE UPLOADS PUBLIC
app.use("/uploads", express.static(path.join(__dirname, "upload")));

// ROUTES
const adminrouter = require("./routes/adminroutes");
const jobseekerrouter = require("./routes/jobseekerroutes");
const recruiterrouter = require("./routes/recruiterroutes");
const chatbotroutes = require("./routes/chatbotroutes");
const meetingRoutes = require("./routes/meetingroutes");
const aiRoutes = require("./routes/airoutes"); // ✅ NEW AI ROUTES

// Add this line with other route registrations
app.use("/api/meetings", meetingRoutes);
app.use("/api/ai", aiRoutes); // ✅ REGISTER AI ROUTES
app.use("", chatbotroutes);
app.use("", adminrouter);
app.use("", jobseekerrouter);
app.use("", recruiterrouter);
app.use("/", require("./routes/chatbotroutes"));

// Test email endpoint
app.get('/test-email', async (req, res) => {
  const { sendApplicationReceivedEmail } = require('./services/emailService');

  try {
    await sendApplicationReceivedEmail(
      'your-email@gmail.com', // Replace with your email
      'Test User',
      'Software Engineer'
    );
    res.send('✅ Email sent! Check your inbox (and spam folder).');
  } catch (err) {
    res.status(500).send('❌ Email failed: ' + err.message);
  }
});
// SERVER
const port = process.env.PORT || 2014;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
