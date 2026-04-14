const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { validateRegister } = require('../middleware/validator');

// @desc    Kullanıcı Kaydı
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    try {
        const { username, email, password } = req.body;

        let userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: "Bu kullanıcı adı veya e-posta adresi zaten sisteme kayıtlı." 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ 
            success: true, 
            message: "Kullanıcı kaydı başarıyla oluşturuldu." 
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Kullanıcı Girişi (E-posta veya Kullanıcı Adı ile)
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Lütfen tüm alanları doldurunuz." });
        }

        // BURADAKİ .select('+password +avatar') ÇOK ÖNEMLİ KANKA!
        // Eğer modelde 'select: false' dediysen bunlar normalde gelmez, biz zorla getiriyoruz.
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: email }
            ]
        }).select('+password +avatar'); 

        if (!user) {
            return res.status(400).json({ success: false, message: "Giriş bilgileri hatalı. Lütfen kontrol ediniz." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Giriş bilgileri hatalı. Lütfen kontrol ediniz." });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Giriş işlemi başarıyla gerçekleştirildi.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                highScore: user.highScore,
                avatar: user.avatar // ARTIK BURASI DOLU GİDECEK! 🚀
            }
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Şifre Sıfırlama Talebi
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Sisteme kayıtlı kullanıcı bulunamadı." });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `https://tahmin-oyunu-blue.vercel.app/reset-password/${resetToken}`;
    const message = `Şifrenizi sıfırlamak için lütfen aşağıdaki bağlantıya tıklayınız: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Şifre Sıfırlama Talebi',
        message
      });
      res.status(200).json({ success: true, message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi." });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: "E-posta gönderimi sırasında teknik bir hata oluştu." });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Yeni Şifre Belirleme
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Geçersiz veya süresi dolmuş işlem kodu." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Şifreniz başarıyla güncellenmiştir." });
  } catch (err) {
    next(err);
  }
};