const nodemailer = require('nodemailer');


const gmailTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'blsailaja07@gmail.com', //gmail id
        pass: 'krishna'  // app password
    }
});


const mailOptions = {
    from: 'blsailaja2004@gmail.com',
    to: 'blsailaja07@gmail.com',
    subject: 'MSWD PROJECT TEST MAIL',
    html: '<font color=red>Hello Sailaja</font>'
};


gmailTransporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.error('Error sending email through Gmail:', error.message);
    } else {
        console.log('Email Sent Successfully');
    }
});