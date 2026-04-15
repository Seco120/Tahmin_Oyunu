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

    const res = await fetch('https://tahmin-oyunu-dket.onrender.com/api/users/profile', {
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
      const res = await fetch(`https://tahmin-oyunu-dket.onrender.com/api/users/search?q=${searchTerm}`);
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
    <header className="w-full bg-white sticky top-0 z-[9999] shadow-[0_10px_30px_rgba(0,0,0,0.1)] h-[80px] md:h-[95px] font-['Montserrat'] flex items-center">
      <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between px-4 md:px-12 relative w-full">
        
        {/* SOL: LOGO */}
        <Link 
          to="/" 
          className="flex items-center gap-2 md:gap-4 no-underline shrink-0 group z-[10001]"
        >
          <div className="h-[55px] md:h-[85px] w-auto transition-transform duration-300 group-hover:scale-105">
            <img src={logoImg} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col uppercase text-[#1a2c3d] ml-1">
            <span className="font-[1000] text-[11px] md:text-[20px] leading-[1.1] tracking-tighter">SAYI TAHMİN</span>
            <span className="font-[1000] text-[13px] md:text-[24px] leading-[0.8] tracking-tighter text-[#ff7b00]">OYUNU</span>
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

         {/* 🔥 ARENA BUTONU */}
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
        <div className="flex items-center gap-4 z-[10001]">
          {/* ARAMA ÇUBUĞU */}
          <div className="hidden md:flex flex-col relative" ref={searchRef}>
            <div className="flex items-center w-[180px] bg-[#f4f7fa] px-4 h-[40px] rounded-full border-2 border-transparent focus-within:border-[#ff7b00]/30 transition-all">
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
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-[50px] right-0 md:left-0 w-[260px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1100]"
                >
                  {searchResults.map((user, index) => {
                    const rank = getRankInfo(user.highScore || 0); 
                    return (
                      <div 
                        key={index} 
                        onClick={() => { navigate(`/profile/${user._id}`); setSearchTerm(''); }}
                        className="flex items-center justify-between p-4 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-[#1a2c3d] uppercase leading-none">
                            {user.username}
                          </span>
                          <span className={`text-[9px] font-black uppercase mt-1 ${rank.color}`}>
                            {rank.title}
                          </span>
                        </div>
                        <div className="text-right">
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
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#1a2c3d] to-[#2c4e7a] border-2 border-[#ff7b00] flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95 overflow-hidden z-[10002]"
              >
                {userData?.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt="Profil" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-xl md:text-2xl">🏆</span>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    /* Mobilde sağa fazla yanaşmasın diye right-0 verdik */
                    className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 p-5 z-[10003]"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Profil Resmi / Avatar */}
                      <div className="w-20 h-20 bg-[#f4f7fa] rounded-full flex items-center justify-center mb-3 overflow-hidden border-4 border-white shadow-md ring-2 ring-[#ff7b00]/20">
                        {userData?.avatar ? (
                          <img src={userData.avatar} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl text-[#ff7b00]">🏆</span>
                        )}
                      </div>
                      
                      <h4 className="font-black text-[#1a2c3d] text-lg uppercase tracking-tight">
                        {userData?.username || "Oyuncu"}
                      </h4>
                      
                      <div className="w-full mt-4 bg-[#f4f7fa] rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase text-gray-500">
                          <span>High Score:</span> 
                          <span className="text-[#ff7b00] text-sm">{userData?.score || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase text-gray-500">
                          <span>Lig:</span> 
                          <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 ${userData?.rankColor || 'text-[#1a2c3d]'}`}>
                            {userData?.rank || "BRONZ"}
                          </span>
                        </div>

                        {/* DÜZENLEME ALANI */}
                        <div className="border-t border-gray-200/50 mt-2 pt-2">
                          {isEditing ? (
                            <div className="flex flex-col gap-3 mt-2">
                              {/* Önizleme & Foto Yükleme */}
                              <div className="relative group mx-auto mb-2">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                   <img src={newAvatar || "/default-avatar.png"} className="w-full h-full object-cover" alt="avatar-preview" />
                                </div>
                                <label className="absolute -bottom-1 -right-1 bg-[#ff7b00] text-white p-2 rounded-full cursor-pointer shadow-xl hover:scale-110 transition-transform border-2 border-white">
                                  <span className="text-[12px] block leading-none">📸</span>
                                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                              </div>
                              
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-black text-gray-400 ml-2">KULLANICI ADI</label>
                                <input 
                                  type="text" 
                                  value={newName} 
                                  onChange={(e) => setNewName(e.target.value)}
                                  className="w-full text-xs font-bold p-3 rounded-xl border-2 border-transparent focus:border-[#ff7b00]/20 bg-white shadow-sm outline-none text-[#1a2c3d]"
                                  placeholder="Yeni adın..."
                                />
                              </div>

    {status.msg && (
      <div className={`text-[10px] font-bold py-2 px-3 rounded-lg text-center shadow-sm ${
        status.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {status.msg}
      </div>
    )}

    <div className="flex gap-2">
      <button 
        onClick={handleUpdate} 
        className="flex-[2] bg-[#ff7b00] text-white text-[9px] font-[1000] py-3 rounded-xl hover:bg-orange-400 hover:shadow-lg active:scale-95 transition-all uppercase tracking-wider"
      >
        KAYDET
      </button>
      <button 
        onClick={() => { setIsEditing(false); setStatus({type:'', msg:''}); }} 
        className="flex-1 bg-white text-red-500 border-2 border-red-500 text-[9px] font-[1000] py-3 rounded-xl hover:bg-red-50 active:scale-95 transition-all uppercase tracking-wider"
      >
        İPTAL
      </button>
    </div>
  </div>
) : (
  <button 
    onClick={() => setIsEditing(true)} 
    className="w-full bg-[#f4f7fa] py-3.5 rounded-2xl text-[10px] font-black text-[#1a2c3d] uppercase mt-2 tracking-widest hover:bg-orange-50 hover:text-[#ff7b00] transition-all border-2 border-transparent hover:border-orange-100"
  >
    ⚙️ Profili Düzenle
  </button>
)}
          </div>
          {/* DÜZENLEME ALANI BİTİŞ */}
        </div>
        
        <button 
          onClick={handleLogout} 
          className="w-full mt-4 py-3.5 text-red-500 text-[10px] font-[1000] uppercase hover:bg-red-50 rounded-2xl transition-all tracking-[0.15em] border border-transparent hover:border-red-100"
        >
          GÜVENLİ ÇIKIŞ
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
            </div>
          )}

          {/* MOBİL MENÜ TETİKLEYİCİ - z-index ve aktiflik alanı artırıldı */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden flex items-center justify-center w-10 h-10 bg-[#f4f7fa] rounded-xl text-2xl text-[#1a2c3d] active:scale-90 transition-transform z-[10001]"
          >
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
      /* h-[100dvh] kullanarak mobil tarayıcı çubuklarının kaydırma hatasını önledik */
      className="fixed top-0 right-0 w-[85%] h-[100dvh] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.15)] lg:hidden flex flex-col p-8 z-[11000] overflow-y-auto"
    >
      {/* KAPATMA BUTONU */}
      <div className="flex justify-end mb-8">
        <button 
          onClick={() => setIsMenuOpen(false)} 
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f4f7fa] text-2xl text-[#1a2c3d] hover:text-[#ff7b00] active:scale-90 transition-all"
        >
          ✕
        </button>
      </div>
      
      {/* NAVİGASYON LİNKLERİ */}
      <nav className="flex flex-col gap-6 mb-8">
        {navItems.filter(item => item.show).map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            onClick={() => setIsMenuOpen(false)} 
            className="text-[#1a2c3d] font-[1000] text-3xl uppercase italic tracking-tighter no-underline border-b-4 border-gray-50 pb-3 active:text-[#ff7b00] transition-colors"
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* MOBİL ARAMA ÇUBUĞU */}
      <div className="relative mb-8" ref={searchRef}>
        <div className="flex items-center w-full bg-[#f4f7fa] px-4 h-[55px] rounded-2xl border-2 border-transparent focus-within:border-[#ff7b00]/30 transition-all shadow-inner">
          <span className="text-gray-400 mr-2 text-xl">{isSearching ? '⏳' : '🔍'}</span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Oyuncu ara..." 
            className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#1a2c3d]" 
          />
        </div>

        {/* MOBİL ARAMA SONUÇLARI */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-[65px] left-0 w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 overflow-y-auto max-h-[300px] z-[12000]"
            >
              {searchResults.map((user, index) => {
                const rank = getRankInfo(user.highScore || 0);
                return (
                  <div 
                    key={index} 
                    onClick={() => { navigate(`/profile/${user._id}`); setIsMenuOpen(false); }} 
                    className="flex items-center justify-between p-4 hover:bg-orange-50 border-b border-gray-50 active:bg-orange-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                          <img src={user.avatar || "/default-avatar.png"} className="w-full h-full object-cover" alt="avatar" />
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[12px] font-black text-[#1a2c3d] uppercase leading-none">{user.username}</span>
                         <span className={`text-[10px] font-black uppercase tracking-tighter mt-1 ${rank.color}`}>{rank.title}</span>
                       </div>
                    </div>
                    <span className="text-xs font-[1000] text-[#ff7b00] italic">{user.highScore || 0} P</span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ALT KISIM (ARENA & ÇIKIŞ) */}
      <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
        {isLoggedIn && (
          <>
            <NavLink 
              to="/game" 
              onClick={() => setIsMenuOpen(false)} 
              className="no-underline"
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="text-[#ff7b00] font-[1000] text-2xl uppercase italic tracking-tighter text-center bg-orange-50 py-5 rounded-3xl shadow-sm border-2 border-orange-100/50"
              >
                ARENA'YA GİR 🔥
              </motion.div>
            </NavLink>
            
            <button 
              onClick={handleLogout} 
              className="text-red-500 font-[1000] text-xs uppercase tracking-[0.3em] py-4 active:opacity-60 transition-opacity"
            >
              GÜVENLİ ÇIKIŞ YAP
            </button>
          </>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </header>
  );
};

export default Header;