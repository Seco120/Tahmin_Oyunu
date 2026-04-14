const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const app = express();

// 1. TEMEL MIDDLEWARE'LER
app.use(cors()); 

// KRİTİK AYAR: Profil resimleri (Base64) için limit artırıldı kanka 🚀
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// 2. GÜVENLİK (Rate Limiter rotalardan önce gelmeli!)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Çok fazla istek attın kanka, biraz dinlen."
});
app.use('/api/', limiter);

// 3. ROTALAR
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 4. İLK ROTA
app.get('/', (req, res) => {
  res.send('Tahmin Oyunu API Canavar Gibi Çalışıyor! 🚀');
});

// 5. VERİTABANI BAĞLANTISI
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Veritabanına bağlandık kanka, skorlar güvende! ✅"))
  .catch((err) => console.log("Bağlantı hatası: ", err));

// 6. MERKEZİ HATA YAKALAYICI (En altta durmalı)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Sunucuda bir şeyler ters gitti!",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 7. PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda yayında. İlk adımı attık kanka!`);
});