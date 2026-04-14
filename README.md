# 🚀 PUSH LUCK | MERN Stack Sayı Tahmin Oyunu

**Push Luck**, sıradan sayı tahmin oyunlarını geride bırakan, modern **UI/UX** tasarımı, akıcı animasyonları ve rekabetçi "Streak" modu ile kullanıcıyı içine çeken tam kapsamlı bir web uygulamasıdır. **MERN Stack** (MongoDB, Express, React, Node.js) mimarisi üzerine kurulu olan proje, hileye karşı korumalı güvenli bir backend yapısı ile profesyonel bir oyun deneyimi sunar.

---

## 📸 Ekran Görüntüleri & Arayüz

Oyunun modern ve neon esintili arayüzünden kesitler:

| 🎮 1. Karşılama ve Giriş Paneli |
| :---: |
| <img src="https://raw.githubusercontent.com/Seco120/tahmin-oyun/main/screenshots/foto1.png" width="100%" alt="Push Luck Giriş" /> |
| *Kullanıcı dostu, interaktif giriş ekranı. Stateless JWT tabanlı auth sistemi ile güvenli oturum açma.* |

| 🎲 2. Ana Lobi (Mod Seçimi) |
| :---: |
| <img src="https://raw.githubusercontent.com/Seco120/tahmin-oyun/main/screenshots/foto2.png" width="100%" alt="Push Luck Lobi" /> |
| *Classic ve Streak modları arasında geçiş yapılan, dinamik arka plan efektlerine sahip ana menü.* |

| 🎯 3. Gameplay (Oyun Alanı) |
| :---: |
| <img src="https://raw.githubusercontent.com/Seco120/tahmin-oyun/main/screenshots/foto3.png" width="100%" alt="Push Luck Oyun Alanı" /> |
| *Can barı, seviye takibi ve jokerlerin (Lens/Scanner) aktif olduğu oyun ekranı. Tüm karşılaştırma mantığı backend tarafında döner.* |

| 🔮 4. Detaylı Oyun Rehberi |
| :---: |
| <img src="https://raw.githubusercontent.com/Seco120/tahmin-oyun/main/screenshots/foto4.png" width="100%" alt="Push Luck Rehber" /> |
| *Klasik ve Streak modlarının kurallarını ve stratejik jokerlerin (Özel Yetenekler) kullanımını anlatan interaktif rehber.* |

| 🏆 5. Global Sıralama (Leaderboard) |
| :---: |
| <img src="https://raw.githubusercontent.com/Seco120/tahmin-oyun/main/screenshots/foto5.png" width="100%" alt="Push Luck Sıralama" /> |
| *MongoDB'den anlık çekilen verilerle oluşturulan, rütbe (Platin, Gümüş, Bronz) sistemli Top 5 Oyuncu tablosu.* |

> *Not: Bu ekran görüntüleri, uygulamanın tarayıcı üzerindeki gerçek halini yansıtmaktadır.*

---

## 🛡️ Mimari ve Güvenlik Odaklı Özellikler

Bu proje, veri güvenliğini ve adil oyun deneyimini ön planda tutan profesyonel bir mimariye sahiptir.

### 🔐 Kimlik Doğrulama ve Güvenlik
* **JWT (JSON Web Token):** Kullanıcı oturumları, stateless ve güvenli bir şekilde JWT ile yönetilir. Tokenlar HTTP-Only cookie'lerde veya güvenli header'larda taşınarak XSS saldırılarına karşı korunur.
* **Bcrypt Password Hashing:** Kullanıcı şifreleri veritabanına asla yalın halde kaydedilmez; `bcrypt` algoritması ile tek yönlü hashlenerek korunur.
* **Hile Koruması (Server-Side Logic):** Oyunun temel mantığı (sayı üretimi, tahmin doğrulaması) client tarafında değil, backend tarafında işlenir. Bu sayede tarayıcı konsolundan hile yapılması veya `targetNumber`'ın görülmesi imkansızdır.

### 🛠️ Gelişmiş Teknik Stack
* **React & Tailwind CSS:** Atomik component yapısı ve modern, responsive tasarım.
* **Framer Motion:** Kullanıcı etkileşimlerini (buton efektleri, sayfa geçişleri) güçlendiren pürüzsüz animasyonlar.
* **Context API:** Uygulama genelinde kullanıcı verilerinin ve oyun durumunun senkronizasyonu.
* **RESTful API (Node.js/Express):** Ölçeklenebilir ve standartlara uygun backend mimarisi.
* **Mongoose Models:** Esnek MongoDB şemaları ile optimize edilmiş veri depolama.

---

## 🛠️ Kullanılan Teknolojiler

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

---

## 👨‍💻 Geliştirici

**İrfan Sercan Ergüzel** - *Junior Software Developer*

[LinkedIn Profilim](https://www.linkedin.com/in/isercanerguzel/) | [GitHub Profilim](https://github.com/Seco120)

---

## 📜 Lisans

Bu proje MIT lisansı altındadır.
