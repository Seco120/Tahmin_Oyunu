const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // 587 portu için false olmalı kanka
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Buraya "Uygulama Şifresi" gelecek (Normal şifre değil!)
      },
      tls: {
        rejectUnauthorized: false // Sertifika hatalarını es geç, bağlantıyı koparma
      }
    });

    const mailOptions = {
      from: `"Tahmin Oyunu 🎮" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `
        <div style="font-family: sans-serif; border: 2px solid #ff7b00; padding: 20px; border-radius: 15px;">
          <h2 style="color: #ff7b00;">Şifre Sıfırlama Talebi</h2>
          <p>${options.message}</p>
          <br>
          <p style="font-size: 11px; color: gray;">Eğer bu talebi sen yapmadıysan bu maili görmezden gel kanka.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail başarıyla uçtu! Mesaj ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("🔥 NODEMAILER HATASI:", error);
    throw error; // Hatayı yukarı fırlat ki Controller yakalayıp 500 dönsün (biz de logdan görelim)
  }
};

module.exports = sendEmail;