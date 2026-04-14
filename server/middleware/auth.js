const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  
  // Detaylı loglama (Hata çözmek için hayat kurtarır)
  console.log("Gelen Token:", token); 

  // Sadece token'ın varlığını değil, "undefined" yazısı olup olmadığını da kontrol et
  if (!token || token === 'undefined' || token === 'null') {
    console.log("HATA: Token bulunamadı veya geçersiz format!");
    return res.status(401).json({ msg: "Yetkisiz erişim: Biletiniz eksik!" });
  }

  try {
    // 3. Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Hatırlatma: Senin sign yaparken kullandığın key neyse o gelir. 
    // Eğer { id: user._id } şeklinde imzaladıysan req.user.id kullanmalısın.
    req.user = decoded; 
    
    next(); 
  } catch (err) {
    console.log("HATA: Token doğrulanamadı!", err.message);
    res.status(401).json({ success: false, message: "Token geçersiz veya süresi dolmuş!" });
  }
};