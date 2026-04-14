const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER, // .env dosyana ekle
      pass: process.env.EMAIL_PASS  // .env dosyana ekle (Gmail Uygulama Şifresi)
    }
  });

  const message = {
    from: `"Tahmin Oyunu" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;