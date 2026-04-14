import React, { useState, useEffect, useRef, useCallback } from 'react'; // <-- useCallback ekle
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.png'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [isSearching, setIsSearching] = useState(false);
const searchRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
const [newName, setNewName] = useState(userData?.username || "");
const [newAvatar, setNewAvatar] = useState(userData?.avatar || "");
const [status, setStatus] = useState({ type: '', msg: '' });
  

  // Token kontrolü
  const isLoggedIn = !!localStorage.getItem('token'); 

  // --- OYUNDAKİ RANK SİSTEMİYLE AYNI MANTIK ---
  const getRankInfo = (s) => {
    if (s >= 5000) return { title: "USTA 👑", color: "text-[#00ffff]" };
    if (s >= 3500) return { title: "ELMAS 💎", color: "text-[#b9f2ff]" };
    if (s >= 2000) return { title: "PLATİN 💠", color: "text-[#e5e4e2]" };
    if (s >= 800) return { title: "ALTIN 🏆", color: "text-[#ffd700]" };
    if (s >= 400) return { title: "GÜMÜŞ 🥈", color: "text-[#c0c0c0]" };
    return { title: "BRONZ 🥉", color: "text-[#cd7f32]" };
  };

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) { // Limiti 2MB yaptık (Base64 için daha rahat olur)
      setStatus({ type: 'error', msg: "Resim çok büyük! Max 2MB." });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAvatar(reader.result); // Base64 state'e uçar
    };
    reader.readAsDataURL(file);
  }
};

const handleUpdate = async () => {
  setStatus({ type: '', msg: '' });
  try {
    const token = localStorage.getItem('token');
    const bodyData = {};
    
    if (newName.trim() !== "" && newName !== userData.username) bodyData.username = newName.trim();
    if (newAvatar && newAvatar !== userData.avatar) bodyData.avatar = newAvatar;

    if (Object.keys(bodyData).length === 0) {
      setStatus({ type: 'error', msg: 'Değişiklik yapılmadı!' });
      return;
    }

    const res = await fetch('http://localhost:5000/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();

    if (res.ok) {
      // 1. Backend'den gelen GÜNCEL objeyi localStorage'a çak
      localStorage.setItem('user', JSON.stringify(data.user));

      // 2. State'leri yenile
      syncHeader();
      
      setStatus({ type: 'success', msg: 'Profil güncellendi! ✅' });
      setTimeout(() => setIsEditing(false), 2000);
    } else {
      setStatus({ type: 'error', msg: data.message });
    }
  } catch (err) {
    setStatus({ type: 'error', msg: 'Bağlantı koptu!' });
  }
};

  useEffect(() => {
  const fetchUsers = async () => {
    if (searchTerm.length < 1) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/search?q=${searchTerm}`);
      const data = await res.json();
      setSearchResults(data.slice(0, 7)); // Sadece 7 kişi
    } catch (err) { console.error(err); } 
    finally { setIsSearching(false); }
  };
  const timer = setTimeout(fetchUsers, 300); // Debounce
  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  const handleClick = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) setSearchResults([]);
  };
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);

const syncHeader = useCallback(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (savedUser) {
      const currentScore = savedUser.highScore !== undefined ? savedUser.highScore : (savedUser.score || 0);
      const rankData = getRankInfo(currentScore);
      
      setUserData({
        ...savedUser,
        score: currentScore,
        rank: rankData.title,
        rankColor: rankData.color,
        avatar: savedUser.avatar // Backend'den gelen yeni resim buraya düşecek
      });

      // Düzenleme state'lerini de güncelle ki bir sonraki kayıtta eski veri kalmasın
      setNewName(savedUser.username || "");
      setNewAvatar(savedUser.avatar || ""); 
    }
  }, []); // Bağımlılık boş, çünkü getRankInfo sabit.

  // 2. Sayfa ilk açıldığında ve event'ler tetiklendiğinde çalışacak bekçi
  useEffect(() => {
    syncHeader(); // Sayfa yüklendiğinde çalıştır

    window.addEventListener('storage', syncHeader);
    window.addEventListener('userUpdated', syncHeader);
    window.addEventListener('scoreUpdated', syncHeader);

    return () => {
      window.removeEventListener('storage', syncHeader);
      window.removeEventListener('userUpdated', syncHeader);
      window.removeEventListener('scoreUpdated', syncHeader);
    };
  }, [syncHeader]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Navigasyon Elemanları
  const navItems = [
    { name: 'NASIL OYNANIR?', path: '/how-to-play', show: true },
    { name: 'PUAN DURUMU', path: '/leaderboard', show: true },
    { name: 'GİRİŞ YAP', path: '/login', show: !isLoggedIn },
    { name: 'KAYIT OL', path: '/register', show: !isLoggedIn },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; 
  };

  return (
    <header className="w-full bg-white sticky top-0 z-[1000] shadow-[0_10px_30px_rgba(0,0,0,0.1)] h-[80px] md:h-[95px] font-['Montserrat']">
      <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between px-6 md:px-12 relative">
        
        {/* SOL: LOGO */}
        <Link 
          to="/" 
          className="flex items-center gap-2 md:gap-4 no-underline shrink-0 group"
        >
          <div className="h-[60px] md:h-[85px] w-auto transition-transform duration-300 group-hover:scale-105">
            <img src={logoImg} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col uppercase text-[#1a2c3d]">
            <span className="font-[1000] text-[16px] md:text-[20px] leading-[1] tracking-tighter">SAYI TAHMİN</span>
            <span className="font-[1000] text-[18px] md:text-[24px] leading-[0.8] tracking-tighter text-[#ff7b00]">OYUNU</span>
          </div>
        </Link>

        {/* MASAÜSTÜ NAVİGASYON */}
        <nav className="hidden lg:flex items-center h-full gap-[25px] xl:gap-[45px]"> 
          {navItems.filter(item => item.show).map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={({ isActive }) => `
                h-full flex items-center justify-center
                text-[#1a2c3d] font-[1000] text-[13px] xl:text-[15px] transition-all duration-300 
                no-underline whitespace-nowrap border-b-[3px] uppercase tracking-wide
                ${isActive ? 'border-[#ff7b00] text-[#ff7b00]' : 'border-transparent hover:text-[#ff7b00] hover:border-[#ff7b00]/30'}
              `}
            >
              {item.name}
            </NavLink>
          ))}

          {/* 🔥 ARENA BUTONU (Giriş yapılmışsa parlar) */}
          {isLoggedIn && (
            <NavLink to="/game" className="no-underline ml-4">
              <motion.div
                animate={{ 
                  boxShadow: ["0 0 0px rgba(255,123,0,0.4)", "0 0 20px rgba(255,123,0,0.7)", "0 0 0px rgba(255,123,0,0.4)"] 
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-[#ff7b00] text-white px-8 py-3 rounded-2xl font-[1000] italic text-[13px] tracking-widest shadow-lg shadow-[#ff7b00]/30 hover:scale-105 transition-transform uppercase"
              >
                ARENA'YA GİR 🔥
              </motion.div>
            </NavLink>
          )}
        </nav>

        {/* SAĞ ALAN */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col relative" ref={searchRef}>
  <div className="flex items-center w-[180px] bg-[#f4f7fa] px-4 h-[40px] rounded-full border-2 focus-within:border-[#ff7b00]/30 transition-all">
    <span className="text-gray-400 mr-2">{isSearching ? '⏳' : '🔍'}</span>
    <input 
      type="text" 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Oyuncu ara..." 
      className="w-full bg-transparent border-none outline-none text-xs font-bold text-[#1a2c3d]" 
    />
  </div>

  {/* ARAMA SONUÇLARI DROPDOWN */}
  <AnimatePresence>
    {searchResults.length > 0 && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        className="absolute top-[50px] left-0 w-[260px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1100]"
      >
        {searchResults.map((user, index) => {
  // Burayı highScore yaptık ki getRankInfo puanı okuyabilsin
  const rank = getRankInfo(user.highScore || 0); 
  
  return (
    <div key={index} className="flex items-center justify-between p-4 ...">
      <div className="flex flex-col">
        <span className="text-xs font-black text-[#1a2c3d] uppercase">
          {user.username}
        </span>
        {/* Rank artık doğru görünecek */}
        <span className={`text-[9px] font-black uppercase ${rank.color}`}>
          {rank.title}
        </span>
      </div>
      <div className="text-right">
        {/* Puan kısmını da highScore yaptık */}
        <span className="text-xs font-[1000] text-[#ff7b00] italic">
          {user.highScore || 0} P
        </span>
      </div>
    </div>
  );
})}
      </motion.div>
    )}
  </AnimatePresence>
</div>

          {/* PROFİL MENÜSÜ */}
          {isLoggedIn && (
            <div className="relative" ref={profileRef}>
              <button 
      onClick={() => setIsProfileOpen(!isProfileOpen)}
      // Yuvarlak butonun stili (Mevcut stillerini korudum)
      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#1a2c3d] to-[#2c4e7a] border-2 border-[#ff7b00] flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95 overflow-hidden" // 'overflow-hidden' ekledik
    >
      {/* KRİTİK DEĞİŞİKLİK BURASI KANKA 🚀 */}
      {userData?.avatar ? (
        // Eğer kullanıcının avatarı varsa, resmi göster
        <img 
          src={userData.avatar} 
          alt="Profil" 
          className="w-full h-full object-cover" // Resmin yuvarlağı tam doldurması için
        />
      ) : (
        // Eğer avatar yoksa (boşsa), eski👤 ikonunu veya kupayı göster
        <span className="text-xl md:text-2xl">🏆</span> // Veya 👤
      )}
    </button>

              <AnimatePresence>
  {isProfileOpen && (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-[1001]"
    >
      <div className="flex flex-col items-center text-center">
        {/* Profil Resmi / Avatar */}
        <div className="w-16 h-16 bg-[#f4f7fa] rounded-full flex items-center justify-center mb-2 overflow-hidden border-2 border-[#ff7b00]">
          {userData?.avatar ? (
            <img src={userData.avatar} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl text-[#ff7b00]">🏆</span>
          )}
        </div>
        
        <h4 className="font-black text-[#1a2c3d] text-lg uppercase tracking-tighter">
          {userData?.username || "Oyuncu"}
        </h4>
        
        <div className="w-full mt-4 bg-[#f4f7fa] rounded-xl p-3 space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
            <span>High Score:</span> <span className="text-[#ff7b00]">{userData?.score}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
            <span>Lig:</span> <span className="text-[#1a2c3d]">{userData?.rank}</span>
          </div>

          {/* DÜZENLEME ALANI BAŞLANGIÇ */}
          <div className="border-t border-gray-200 mt-2 pt-2">
           {isEditing ? (
  <div className="flex flex-col gap-2 mt-2 bg-gray-50 p-3 rounded-lg">
    {/* Önizleme */}
    <div className="w-12 h-12 rounded-full overflow-hidden mx-auto border-2 border-[#ff7b00]">
       <img src={newAvatar || "/default-avatar.png"} className="w-full h-full object-cover" />
    </div>
    
    <label className="text-[10px] font-bold text-gray-500 text-left">KULLANICI ADI</label>
    <input 
      type="text" 
      value={newName} 
      onChange={(e) => setNewName(e.target.value)}
      className="w-full text-[10px] p-2 rounded border border-gray-200 outline-none text-black"
    />

    <label className="text-[10px] font-bold text-gray-500 text-left">PROFİL RESMİ SEÇ</label>
    <input 
      type="file" 
      accept="image/*"
      onChange={handleFileChange}
      className="text-[9px] text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
    />

   {status.msg && (
      <div className={`text-[10px] font-bold py-1 px-2 rounded ${
        status.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {status.msg}
      </div>
    )}

    <div className="flex gap-2 mt-2">
      <button onClick={handleUpdate} className="flex-1 bg-[#ff7b00] text-white text-[9px] font-[1000] py-2 rounded-lg hover:shadow-lg transition-all">
        GÜNCELLE
      </button>
      <button onClick={() => { setIsEditing(false); setStatus({type:'', msg:''}); }} className="flex-1 bg-gray-300 text-white text-[9px] font-[1000] py-2 rounded-lg">
        VAZGEÇ
      </button>
    </div>
  </div>
) : (
  <button onClick={() => setIsEditing(true)} className="text-[10px] font-[1000] text-[#ff7b00] uppercase mt-2 tracking-widest hover:underline">
    ⚙️ Ayarları Düzenle
  </button>
)}
          </div>
          {/* DÜZENLEME ALANI BİTİŞ */}
        </div>
        
        <button onClick={handleLogout} className="w-full mt-4 py-3 text-red-500 text-[10px] font-[1000] uppercase hover:bg-red-50 rounded-xl transition-colors tracking-widest">
          GÜVENLİ ÇIKIŞ
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
            </div>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-3xl text-[#1a2c3d]">
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* MOBİL MENÜ */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 w-[80%] h-screen bg-white shadow-2xl lg:hidden flex flex-col p-10 z-[1100] gap-6"
    >
      <button onClick={() => setIsMenuOpen(false)} className="text-4xl text-left mb-8">✕</button>
      
      {navItems.filter(item => item.show).map((item) => (
        <NavLink key={item.name} to={item.path} onClick={() => setIsMenuOpen(false)} className="text-[#1a2c3d] font-[1000] text-2xl uppercase italic tracking-tighter no-underline">
          {item.name}
        </NavLink>
      ))}

      {/* MOBİL ARAMA ÇUBUĞU - EKLEDİĞİMİZ KISIM */}
      <div className="relative mt-4" ref={searchRef}>
        <div className="flex items-center w-full bg-[#f4f7fa] px-4 h-[50px] rounded-2xl border-2 focus-within:border-[#ff7b00]/30 transition-all">
          <span className="text-gray-400 mr-2 text-xl">{isSearching ? '⏳' : '🔍'}</span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Oyuncu ara..." 
            className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#1a2c3d]" 
          />
        </div>

        {/* MOBİL ARAMA SONUÇLARI DROPDOWN */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-[60px] left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1200]"
            >
              {searchResults.map((user, index) => {
                const rank = getRankInfo(user.highScore || 0);
                return (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-none">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-[#1a2c3d] uppercase">{user.username}</span>
                      <span className={`text-[9px] font-black uppercase ${rank.color}`}>{rank.title}</span>
                    </div>
                    <span className="text-xs font-[1000] text-[#ff7b00] italic">{user.highScore || 0} P</span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLoggedIn && (
        <>
          <NavLink to="/game" onClick={() => setIsMenuOpen(false)} className="text-[#ff7b00] font-[1000] text-2xl uppercase italic tracking-tighter no-underline border-t pt-6 mt-2">
            ARENA'YA GİR 🔥
          </NavLink>
          <button onClick={handleLogout} className="text-red-500 font-[1000] text-sm uppercase tracking-widest text-left mt-auto">
            ÇIKIŞ YAP
          </button>
        </>
      )}
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </header>
  );
};

export default Header;