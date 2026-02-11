const nodemailer = require("nodemailer");

// ✅ Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD // App password (not regular password)
  }
});

// ✅ Email Templates
const emailTemplates = {
  applicationReceived: (applicantName, jobTitle) => ({
    subject: `Application Received - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Application Received!</h1>
          </div>
          <div class="content">
            <h2>Hello ${applicantName},</h2>
            <p>Thank you for applying to the <strong>${jobTitle}</strong> position.</p>
            <p>We have successfully received your application and our recruitment team will review it shortly.</p>
            <p>You will receive an update on your application status within 5-7 business days.</p>
            <p>In the meantime, feel free to check the status of your application in your dashboard.</p>
            <a href="http://localhost:3000/jobseeker/profile" class="button">View Dashboard</a>
          </div>
          <div class="footer">
            <p>© 2025 Job Portal. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  applicationShortlisted: (applicantName, jobTitle, meetingLink) => ({
    subject: `🎊 Congratulations! You've been Shortlisted - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin-bottom: 20px; }
          .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .info-box { background: white; padding: 20px; border-left: 4px solid #11998e; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 Congratulations!</h1>
          </div>
          <div class="content">
            <div class="success-badge">✅ APPLICATION SHORTLISTED</div>
            <h2>Hello ${applicantName},</h2>
            <p>Great news! After reviewing your application for <strong>${jobTitle}</strong>, we are pleased to inform you that you have been shortlisted for the next round.</p>
            
            <div class="info-box">
              <h3>📅 Next Steps:</h3>
              <p><strong>Interview Round:</strong> Technical/HR Interview</p>
              <p><strong>Platform:</strong> Online Video Interview (Jitsi)</p>
              <p>You will receive the interview schedule and meeting link shortly.</p>
            </div>

            ${meetingLink ? `
              <div class="info-box">
                <h3>🎥 Interview Meeting Link:</h3>
                <p>Click the button below to join your scheduled interview:</p>
                <a href="${meetingLink}" class="button">Join Interview</a>
              </div>
            ` : ''}

            <p>Please ensure you have a stable internet connection and a quiet environment for the interview.</p>
            <p><strong>Tips for the interview:</strong></p>
            <ul>
              <li>Test your camera and microphone beforehand</li>
              <li>Keep your resume handy</li>
              <li>Be prepared to discuss your projects and experience</li>
              <li>Dress professionally</li>
            </ul>
            
            <a href="http://localhost:3000/jobseeker/meetings" class="button">View Meeting Details</a>
          </div>
          <div class="footer">
            <p>© 2025 Job Portal. All rights reserved.</p>
            <p>If you have any questions, please contact us at support@jobportal.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  applicationRejected: (applicantName, jobTitle) => ({
    subject: `Application Update - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${applicantName},</h2>
            <p>Thank you for your interest in the <strong>${jobTitle}</strong> position and for taking the time to apply.</p>
            <p>After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
            <p>We encourage you to continue exploring other opportunities on our platform that may be a better fit for your skills and experience.</p>
            <a href="http://localhost:3000/jobseeker/jobs" class="button">Browse More Jobs</a>
            <p style="margin-top: 20px;">We wish you the best in your job search and future endeavors.</p>
          </div>
          <div class="footer">
            <p>© 2025 Job Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// ✅ Send Email Function
const sendEmail = async (to, template) => {
  try {
    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email send error:", error);
    return { success: false, error: error.message };
  }
};

// ✅ Export functions
module.exports = {
  sendApplicationReceivedEmail: (to, applicantName, jobTitle) => {
    return sendEmail(to, emailTemplates.applicationReceived(applicantName, jobTitle));
  },
  
  sendShortlistedEmail: (to, applicantName, jobTitle, meetingLink = null) => {
    return sendEmail(to, emailTemplates.applicationShortlisted(applicantName, jobTitle, meetingLink));
  },
  
  sendRejectionEmail: (to, applicantName, jobTitle) => {
    return sendEmail(to, emailTemplates.applicationRejected(applicantName, jobTitle));
  }
};