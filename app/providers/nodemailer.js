const nodemailer = require('nodemailer');

// Log
const loggerFactory = require('./logger-factory');
const nodemailerLogger = loggerFactory('Nodemailer - email sending');

const userEmail = process.env.USER_EMAIL || 'tg7f4pxcewu5axes@ethereal.email';
const userPassword = process.env.USER_PASSWORD || 'QtP9qd7heRarhuPjXa';

async function nodeMailer(to, subject, text){
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: userEmail,
            pass: userPassword
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: userEmail, // sender address
        to: to, // receiver address
        subject: subject, // Subject line
        text: text, // plain text body
    };

    let info = await transporter.sendMail(mailOptions);
    nodemailerLogger.info(`Reset password link sent with ${info.messageId} message id.`);
}

module.exports = nodeMailer;
