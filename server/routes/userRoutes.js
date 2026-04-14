const express = require('express');
const router = express.Router();
// Controller dosyasını içeri aktarıyoruz
const userController = require('../controllers/userController');
// Token kontrolü yapan middleware (Yolunu kontrol et)
const auth = require('../middleware/auth'); 

// 1. Skor Güncelleme: PUT /api/users/score
// Araya 'auth' koyduk çünkü kimin skorunu güncellediğimizi token'dan anlamalıyız.
router.put('/score', auth, userController.updateScore);

// 2. Liderlik Tablosu: GET /api/users/leaderboard
// Genelde herkesin görebilmesi için 'auth' koymuyoruz.
router.get('/leaderboard', userController.getLeaderboard);
router.put('/profile', auth, userController.updateProfile);
router.get('/search', userController.searchUsers);

module.exports = router;

