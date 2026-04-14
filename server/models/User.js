const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String, 
    default: ""
   },
  highScore: { 
    type: Number, 
    default: 0 
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Şifre sıfırlama token'ı üretme fonksiyonu
userSchema.methods.getResetPasswordToken = function() {
  // 1. Rastgele bir token üret
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Token'ı hashle ve veritabanındaki alana ata
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Geçerlilik süresini ayarla (3 DAKİKA) 🔥
  this.resetPasswordExpire = Date.now() + 3 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);