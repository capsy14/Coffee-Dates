const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from) => {
  // Create Email Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASS);
  // Option for sending email
  const options = {
    from: sent_from,
    to: send_to,
    subject: subject,
    html: message,
  };

  // send email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      console.log("error aa gya");
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
