const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); // Güvenlik için eklendi kanka 🛡️

const app = express();

// 1. GÜVENLİK VE TEMEL MIDDLEWARE'LER
app.use(helmet()); // HTTP başlıklarını korumaya alır (XSS vb. karşı)
app.use(cors()); 

// KRİTİK AYAR: Profil resimleri (Base64) için limit artırıldı 🚀
// Not: 50mb çok geniştir, ileride 5mb-10mb civarına çekmen daha güvenli olur kanka.
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));

// 2. RATE LIMITER (Daha akıllıca yapılandırdık)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, // 100 bazen geliştirme aşamasında seni de engelleyebilir, 200 daha rahat olur
  standardHeaders: true, // Rate limit bilgisini başlıklarda gönderir
  legacyHeaders: false,
  message: {
    success: false,
    message: "Çok fazla istek attın kanka, biraz dinlen. 🍵"
  }
});
app.use('/api/', limiter);

// 3. ROTALAR
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 4. HEALTH CHECK (Render vb. servislerin sunucuyu açık tutması için önemli)
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Tahmin Oyunu API Canavar Gibi Çalışıyor! 🚀",
    status: "OK",
    timestamp: new Date()
  });
});

// 5. VERİTABANI AYARLARI (Bağlantı seçenekleri güncellendi)
mongoose.set('strictQuery', true); // Mongoose 7/8 uyarısı almamak için
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Veritabanına bağlandık kanka, skorlar güvende! ✅"))
  .catch((err) => {
    console.error("❌ MongoDB Bağlantı hatası: ", err.message);
    process.exit(1); // Bağlantı yoksa sunucuyu boşuna çalıştırma
  });

// 6. OLMAYAN ROTA KONTROLÜ (404)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Aradığın yol yol değil kanka (404)." });
});

// 7. MERKEZİ HATA YAKALAYICI
app.use((err, req, res, next) => {
  console.error("🔥 HATA:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Sunucuda bir şeyler ters gitti!",
    // Sadece development modunda hata detayını göster
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 8. PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Sunucu Yayında!
  📡 Port: ${PORT}
  🌍 Mod: ${process.env.NODE_ENV || 'development'}
  ✅ Her şey yolunda kanka!
  `);
});