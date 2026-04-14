const User = require('../models/User');

// @desc    Yüksek skoru güncelle
// @route   PUT /api/users/score
exports.updateScore = async (req, res, next) => {
  try {
    const { score } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
      return res.json({ 
        success: true, 
        message: "Yeni rekor! Skor güncellendi.", 
        highScore: user.highScore 
      });
    }

    res.json({ 
      success: true, 
      message: "Skor mevcut rekordan düşük, güncellenmedi.", 
      highScore: user.highScore 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    En yüksek puanlı 5 kullanıcıyı getir
// @route   GET /api/users/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find()
      .select('username highScore avatar') // Header'da lazım olursa avatarı da ekledim
      .sort({ highScore: -1 })
      .limit(5);

    res.status(200).json({ 
      success: true, 
      data: topUsers 
    });
  } catch (err) {
    next(err); 
  }
};

// @desc    Oyuncu ara
// @route   GET /api/users/search
exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const users = await User.find({ 
      username: { $regex: `^${query}`, $options: 'i' } 
    })
    .select('username highScore avatar -_id') 
    .limit(7);

    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: "Arama işlemi sırasında bir hata oluştu." });
  }
};

// @desc    Profil bilgilerini güncelle (İsim ve Avatar)
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;
    const userId = req.user.userId;
    let updateData = {};

    if (username && username.trim() !== "") updateData.username = username.trim();
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Kullanıcı kaydı bulunamadı." });
    }

    const userObj = updatedUser.toObject();

    console.log("Gönderilmeye hazır kullanıcı:", userObj);

    res.json({ 
      success: true, 
      message: "Profil bilgileriniz başarıyla güncellendi.", 
      user: {
        id: userObj._id,
        username: userObj.username,
        email: userObj.email,
        highScore: userObj.highScore,
        avatar: userObj.avatar
      }
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Bu kullanıcı adı halihazırda kullanılmaktadır." 
      });
    }
    next(err);
  }
};