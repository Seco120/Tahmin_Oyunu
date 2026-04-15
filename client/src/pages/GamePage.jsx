import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamePage() {
  const [gameState, setGameState] = useState('lobby'); 
  const [gameMode, setGameMode] = useState(null); 
  const [customSettings, setCustomSettings] = useState({ min: 1, max: 100, lives: 10 });

  // --- OYUN MOTORU ---
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [currentLives, setCurrentLives] = useState(10);
  const [message, setMessage] = useState({ text: 'Tahminini yap kanka!', type: 'default' });
  const [streakLevel, setStreakLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [range, setRange] = useState({ min: 1, max: 100 });
  const isGuest = localStorage.getItem('isGuest') === 'true';

  // --- JOKERLER & İPUÇLARI ---
  const [powers, setPowers] = useState({ lens: 3, scanner: 3 }); 
  const [revealedDigits, setRevealedDigits] = useState({}); 
  const [activeHint, setActiveHint] = useState(null);

  // 🔥 YENİ: KÖŞEDEKİ PROFİL PANELİ İÇİN STATE
  const [profileData, setProfileData] = useState({ score: 0, rank: "BRONZ 🥉", color: "text-[#cd7f32]" });

  // --- RANK SİSTEMİ FONKSİYONU ---
  const getRankInfo = (s) => {
    if (s >= 5000) return { title: "USTA 👑", color: "text-[#00ffff]", shadow: "shadow-[0_0_30px_rgba(0,255,255,0.4)]" };
    if (s >= 3500) return { title: "ELMAS 💎", color: "text-[#b9f2ff]", shadow: "shadow-[0_0_20px_rgba(185,242,255,0.3)]" };
    if (s >= 2000) return { title: "PLATİN 💠", color: "text-[#e5e4e2]", shadow: "" };
    if (s >= 800) return { title: "ALTIN 🏆", color: "text-[#ffd700]", shadow: "" };
    if (s >= 400) return { title: "GÜMÜŞ 🥈", color: "text-[#c0c0c0]", shadow: "" };
    return { title: "BRONZ 🥉", color: "text-[#cd7f32]", shadow: "" };
  };

 // 🔥 YENİ: SAYFA AÇILDIĞINDA VE SKOR GÜNCELLENDİĞİNDE VERİYİ ÇEKER
const loadProfileData = () => {
  if (isGuest) {
    setProfileData({ score: 0, rank: "MİSAFİR 🎮", color: "text-gray-400", avatar: null });
    return;
  }

  const userStr = localStorage.getItem('user');
  if (userStr) {
    const savedUser = JSON.parse(userStr);
    
    // Skor ve Rank Hesaplama
    const highScore = savedUser.highScore !== undefined ? savedUser.highScore : (savedUser.score || 0);
    const rankData = getRankInfo(highScore);

    // State Güncelleme (Avatar buraya eklendi)
    setProfileData({
      username: savedUser.username,
      score: highScore,
      rank: rankData.title,
      color: rankData.color,
      avatar: savedUser.avatar || (savedUser.user && savedUser.user.avatar) // Base64 buraya geliyor
    });
  }
};

  useEffect(() => {
  loadProfileData();

  // Telsizi dinlemeye devam
  window.addEventListener('storage', loadProfileData);
  window.addEventListener('userUpdated', loadProfileData); // Profil güncellenince tetiklenir
  window.addEventListener('scoreUpdated', loadProfileData);

  return () => {
    window.removeEventListener('storage', loadProfileData);
    window.removeEventListener('userUpdated', loadProfileData);
    window.removeEventListener('scoreUpdated', loadProfileData);
  };
}, []);

 const submitScoreToBackend = async (finalScore) => {
  if (isGuest) return;

    const token = localStorage.getItem('token');
    
    if (!token || token === 'undefined' || finalScore === undefined) return;

    try {
      const response = await fetch('https://tahmin-oyunu-dket.onrender.com/api/users/score', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ score: finalScore })
      });

      if (response.ok) {
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        const updatedUser = { ...currentUser, highScore: finalScore, score: finalScore };

        localStorage.setItem('user', JSON.stringify(updatedUser));

        // ✅ Header ve Sol Panel'e "Veri değişti" sinyalini çakıyoruz
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("scoreUpdated"));
        
        console.log("Rekor kaydedildi ve arayüz uyandırıldı! 🚀");
      }
    } catch (err) {
      console.error("Hata:", err);
    }
  };

  // --- OYUN MANTIK FONKSİYONLARI ---
  const checkLifeRewards = (level) => {
    let bonus = 0;
    if (level === 3) bonus = 3;
    else if (level === 8) bonus = 3;
    else if (level === 15) bonus = 5;
    else if (level > 15 && level % 10 === 5) bonus = 5;

    if (bonus > 0) {
      setCurrentLives(prev => prev + bonus);
      setMessage({ text: `LEVEL BONUSU: +${bonus} CAN! 🎁`, type: 'success' });
    }
  };

  const initGame = (mode, isNewGame = false) => {
    if (mode === 'streak' && isGuest) return;
    let target, lives, minVal, maxVal;
    setGameMode(mode);
    setRevealedDigits({}); 

    if (mode === 'classic') {
      setScore(0); 
      setStreakLevel(1);
      minVal = customSettings.min || 1;
      maxVal = customSettings.max || 100;
      target = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      lives = customSettings.lives;
      setPowers({ lens: 0, scanner: 0 }); 
    } else {
      const targetLevel = isNewGame ? 1 : streakLevel;
      if (isNewGame) {
        setStreakLevel(1);
        setScore(0);
        setPowers({ lens: 3, scanner: 3 });
      }

      maxVal = 10 * Math.pow(2, targetLevel - 1);
      minVal = 1;
      target = Math.floor(Math.random() * maxVal) + 1;
      lives = isNewGame ? 10 : currentLives;
    }

    setRange({ min: minVal, max: maxVal });
    setTargetNumber(target);
    setCurrentLives(lives);
    setAttempts([]);
    setActiveHint(null);
    setGameState('playing');

    if (!isNewGame && mode === 'streak') {
      checkLifeRewards(streakLevel);
    } else {
      setMessage({ text: mode === 'streak' ? `LEVEL ${isNewGame ? 1 : streakLevel} - BAŞLA!` : 'Sayıyı tuttum!', type: 'default' });
    }
  };

  const useLens = () => {
    if (gameMode === 'streak' && powers.lens > 0 && !activeHint) {
      const isEven = targetNumber % 2 === 0;
      setActiveHint(isEven ? 'ÇİFT' : 'TEK');
      setPowers(p => ({ ...p, lens: p.lens - 1 }));
      setMessage({ text: "MERCEK AKTİF! 🔍", type: 'success' });
    }
  };

  const useScanner = () => {
    if (gameMode === 'streak' && powers.scanner > 0) {
      const targetStr = targetNumber.toString();
      const indices = [];
      for (let i = 0; i < targetStr.length; i++) {
        if (!revealedDigits[i]) indices.push(i);
      }

      if (indices.length > 0) {
        const randomIndex = indices[Math.floor(Math.random() * indices.length)];
        setRevealedDigits(prev => ({ ...prev, [randomIndex]: targetStr[randomIndex] }));
        setPowers(p => ({ ...p, scanner: p.scanner - 1 }));
        setMessage({ text: "BASAMAK TARANDI! 📡", type: 'success' });
      }
    }
  };

  const handleGuess = (e) => {
    e.preventDefault();
    const num = parseInt(guess);
    
    if (isNaN(num) || num < range.min || num > range.max) {
      setMessage({ text: `Lütfen ${range.min} ile ${range.max} arası bir sayı gir! ⚠️`, type: 'default' });
      return;
    }

    const newAttempts = [num, ...attempts];
    setAttempts(newAttempts);
    setGuess('');

    if (num === targetNumber) {
      const finalDigits = {};
      targetNumber.toString().split('').forEach((d, i) => finalDigits[i] = d);
      setRevealedDigits(finalDigits);

      const points = Math.floor((range.max / newAttempts.length) * (gameMode === 'streak' ? streakLevel : 1));
      
      if (gameMode === 'streak') {
        setScore(prev => prev + points);
        setMessage({ text: 'MÜKEMMEL! BİLDİN! 🔥', type: 'success' });
        setTimeout(() => setStreakLevel(prev => prev + 1), 1000);
      } else {
        setGameState('result');
      }
    } else {
      if (currentLives <= 1) {
        setCurrentLives(0);
        setGameState('result');
        if (gameMode === 'streak') {
          // Rekor kontrolü: Eğer şu anki skor record'dan büyükse gönder
          if (score > profileData.score) {
            submitScoreToBackend(score);
          }
        }
      } else {
        setCurrentLives(prev => prev - 1);
        setMessage({
          text: num < targetNumber ? 'DAHA YUKARI! ⬆️' : 'DAHA AŞAĞI! ⬇️',
          type: num < targetNumber ? 'up' : 'down'
        });
      }
    }
  };

  useEffect(() => {
    if (gameMode === 'streak' && streakLevel > 1) {
      initGame('streak', false);
    }
  }, [streakLevel]);

  return (
  <div className="h-[100svh] w-full pt-2 pb-2 px-4 font-['Montserrat'] bg-transparent flex flex-col items-center overflow-hidden text-white relative">
    <style>{`
      input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      input[type=number] { -moz-appearance: textfield; }
      body { overflow: hidden; position: fixed; width: 100%; }
    `}</style>

    {/* 🔥 YENİ: KOMPAKT PROFİL HEADER (ARTIK ÜSTE BİNMEZ) */}
    <AnimatePresence>
      {(gameState === 'playing' || gameState === 'result') && gameMode === 'streak' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-md mb-2 bg-[#1a2c3d]/60 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#ff7b00] overflow-hidden">
              {profileData.avatar ? (
                <img src={profileData.avatar} className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-xl">👤</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className={`text-[8px] font-black uppercase tracking-tighter ${profileData.color}`}>
                {profileData.rank}
              </span>
              <span className="text-xs font-bold truncate max-w-[80px]">{profileData.username}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-[1000] italic text-[#ff7b00]">{profileData.score}</span>
            <span className="text-[8px] font-black opacity-40 uppercase">Best</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

      <AnimatePresence mode="wait">
        {gameState === 'playing' && (
          <motion.div key="playing" initial={{ opacity: 0}} animate={{ opacity: 1 }} className="w-full max-w-2xl">
            <div className="text-center mb-4">
              <span className="bg-[#1a2c3d] text-[#ff7b00] px-6 py-2 rounded-full font-black italic text-sm border border-[#ff7b00]/30 uppercase tracking-widest">
                ARALIK: {range.min} — {range.max}
              </span>
            </div>

            <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-xl p-4 md: p-6 rounded:[2rem] md:rounded-[2.5rem] border border-white/20 shadow-2xl text-[#1a2c3d]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-2 text-black/50">CANLAR</span>
                <div className="flex gap-1 flex-wrap max-w-[100px] md:max-w-[200px]">
  {[...Array(currentLives)].map((_, i) => (
    <motion.div key={i} className="w-1.5 md:w-2.5 h-6 md:h-8 bg-[#ff7b00] rounded-full shadow-[0_0_15px_rgba(255,123,0,0.5)]" />
                  ))}
                </div>
              </div>
              <div className="text-right text-black">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1">
                  {gameMode === 'streak' ? `SEVİYE ${streakLevel}` : 'CLASSIC MOD'}
                </span>
                {gameMode === 'streak' && <span className="text-5xl font-[1000] italic leading-none">{score}</span>}
              </div>
            </div>

            {/* OYUN ALANI */}
<div className="bg-[#162a44] h-20 md:h-110 p-0 md:p-0 rounded-[2.5rem] md:rounded-[4 rem] shadow-2xl border-4 border-white/5 relative overflow-hidden text-center w-full max-w-2xl">
  
  {/* Üstteki basamaklar ve mesaj alanı boşlukları azaltıldı */}
  <div className="flex justify-center gap-2 mb-1 h-6 p-6 ">
                {Object.keys(revealedDigits).length > 0 && 
                  targetNumber.toString().split('').map((_, i) => (
                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} key={i} 
                      className={`w-8 h-10 border-2 rounded-lg flex items-center justify-center font-black 
                        ${revealedDigits[i] ? 'border-[#ff7b00] text-[#ff7b00] bg-[#ff7b00]/10' : 'border-white/10 text-white/10'}`}>
                      {revealedDigits[i] || '?'}
                    </motion.div>
                  ))
                }
              </div>

               {activeHint && (
                 <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute left-8 top-8 bg-[#ff7b00] text-white px-4 py-1 rounded-lg font-black italic text-[10px]">
                    İPUCU: SAYI {activeHint}!
                 </motion.div>
               )}

               <motion.div key={message.text} className={`text-xs font-[1000] uppercase tracking-[0.3em] mb-8 ${message.type === 'up' ? 'text-blue-400' : message.type === 'down' ? 'text-red-400' : 'text-green-400'}`}>
                {message.text}
               </motion.div>

               <form onSubmit={handleGuess}>
                <input 
  autoFocus 
  type="number" 
  inputMode="numeric" // Sayı klavyesini zorlar
  value={guess} 
  onChange={(e) => setGuess(e.target.value)} 
  className={`w-full bg-transparent text-[5rem] sm:text-[8rem] md:text-[11rem] font-[1000] outline-none text-center italic tracking-tighter transition-all ${(parseInt(guess) < range.min || parseInt(guess) > range.max) ? 'text-red-500' : 'text-white'}`} 
  placeholder="?" 
/>
                 <button
    onClick={handleGuess}
    className="w-full sm:w-auto h-10 px-5 bg-[#ff7b00] hover:bg-[#e66a00] text-white font-[1000] text-xl rounded-2xl shadow-[0_8px_0_rgb(204,98,0)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-2"
  >
    TAHMİN ET 🚀
  </button>
               </form>

               {/* BURAYA YAPIŞTIR: Formun bittiği yer */}
<div className="flex flex-wrap justify-center gap-2 mt-1/2 overflow-x-auto pb-3 max-h-24">
  {attempts.map((prevGuess, index) => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      key={index}
      className={`px-3 py-1 rounded-full text-xs font-black border ${
        prevGuess < targetNumber 
          ? 'border-blue-500/50 text-blue-400 bg-blue-400/10' 
          : 'border-red-500/50 text-red-400 bg-red-400/10'
      }`}
    >
      {prevGuess} {prevGuess < targetNumber ? '↑' : '↓'}
    </motion.div>
  ))}
</div>

               {gameMode === 'streak' && (
<div className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 md:gap-5">
                   <div className="relative">
                     <motion.button whileTap={{ scale: 0.9 }} onClick={useLens} disabled={powers.lens === 0 || activeHint} className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-2 ${powers.lens > 0 ? 'bg-[#1a2c3d] border-[#ff7b00]' : 'opacity-10'}`}>
                       <span className="text-xl">🔍</span>
                     </motion.button>
                     <span className="absolute -top-2 -right-2 bg-[#ff7b00] text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">{powers.lens}</span>
                   </div>
                   <div className="relative">
                     <motion.button whileTap={{ scale: 0.9 }} onClick={useScanner} disabled={powers.scanner === 0} className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-2 ${powers.scanner > 0 ? 'bg-[#1a2c3d] border-purple-500' : 'opacity-10'}`}>
                       <span className="text-xl">📡</span>
                     </motion.button>
                     <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">{powers.scanner}</span>
                   </div>
                </div>
               )}
            </div>
          </motion.div>
        )}

        {/* LOBBY, SETUP VE RESULT KISIMLARINDAKİ MANTIĞIN AYNI KALMASI İÇİN BURAYI KISALTTIN */}
        {gameState === 'lobby' && (
           <motion.div key="lobby" className="w-full max-w-4xl text-center">
              <h1 className="text-8xl md:text-[11rem] font-[1000] text-[#1a2c3d] tracking-tighter uppercase italic leading-[0.85] mb-16">PUSH <br /><span className="text-[#ff7b00]">LUCK</span></h1>
              <div className="grid md:grid-cols-2 gap-8 px-6">
                <button 
  onClick={() => !isGuest && initGame('streak', true)} 
  className={`p-12 rounded-[3.5rem] group relative overflow-hidden border-4 transition-all shadow-2xl ${
    isGuest ? "bg-gray-800/50 border-white/5 cursor-not-allowed grayscale" : "bg-[#ff7b00] border-white/20 active:scale-95"
  }`}
>
  {isGuest && (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
      <span className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-full border border-white/20">🔒 KAYIT GEREKLİ</span>
    </div>
  )}
  <span className="relative z-10 text-3xl md:text-5xl font-[1000] italic text-white uppercase tracking-tighter">STREAK</span>
  <div className="absolute -right-6 -bottom-6 text-9xl opacity-20">⚡</div>
</button>
                <button onClick={() => setGameState('classic_setup')} className="bg-[#162a44] p-12 rounded-[3.5rem] group relative overflow-hidden border-4 border-white/10 active:scale-95 transition-all shadow-2xl">
                  <span className="relative z-10 text-3xl md:text-5xl font-[1000] italic text-white uppercase tracking-tighter">CLASSIC</span>
                  <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 group-hover:-rotate-12 transition-transform">⚙️</div>
                </button>
              </div>
           </motion.div>
        )}

        {/* SETUP VE RESULT EKRANLARIN KODUNDAKİ GİBİ BURADA DA DEVAM EDİYOR... */}
        {gameState === 'classic_setup' && (
          <motion.div key="classic_setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg z-10 px-4">
            <div className="bg-[#162a44] p-10 rounded-[4rem] border-4 border-white/5 text-center shadow-3xl">
              <h2 className="text-4xl font-[1000] italic text-white mb-8 uppercase tracking-tighter">CLASSIC <span className="text-[#ff7b00]">AYARLAR</span></h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1a2c3d] p-4 rounded-3xl border-2 border-white/5 focus-within:border-[#ff7b00] transition-all">
                    <label className="text-[10px] font-black opacity-40 block mb-2 uppercase text-white">MİNİMUM</label>
                    <input type="number" value={customSettings.min} onFocus={(e) => e.target.select()} onChange={(e) => setCustomSettings({...customSettings, min: e.target.value === '' ? '' : parseInt(e.target.value)})} className="bg-transparent text-3xl font-black w-full text-center outline-none italic text-white" />
                  </div>
                  <div className="bg-[#1a2c3d] p-4 rounded-3xl border-2 border-white/5 focus-within:border-[#ff7b00] transition-all">
                    <label className="text-[10px] font-black opacity-40 block mb-2 uppercase text-white">MAKSİMUM</label>
                    <input type="number" value={customSettings.max} onFocus={(e) => e.target.select()} onChange={(e) => setCustomSettings({...customSettings, max: e.target.value === '' ? '' : parseInt(e.target.value)})} className="bg-transparent text-3xl font-black w-full text-center outline-none italic text-white" />
                  </div>
                </div>
                <div className="bg-[#1a2c3d] p-6 rounded-3xl border-2 border-white/5 focus-within:border-[#ff7b00] transition-all">
                  <label className="text-[10px] font-black opacity-40 block mb-2 uppercase text-white">HAK SAYISI</label>
                  <div className="flex items-center justify-center gap-8 text-white">
                    <button onClick={() => setCustomSettings({...customSettings, lives: Math.max(1, customSettings.lives - 1)})} className="text-4xl font-black text-[#ff7b00]">−</button>
                    <span className="text-5xl font-[1000] italic w-20">{customSettings.lives}</span>
                    <button onClick={() => setCustomSettings({...customSettings, lives: Math.min(50, customSettings.lives + 1)})} className="text-4xl font-black text-[#ff7b00]">+</button>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex flex-col gap-4">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => initGame('classic', true)} className="bg-[#ff7b00] text-white py-6 rounded-3xl text-2xl font-[1000] italic uppercase shadow-2xl">BAŞLAT 🔥</motion.button>
                <button onClick={() => setGameState('lobby')} className="text-white/30 font-black uppercase text-xs tracking-widest">Vazgeç</button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-[#1a2c3d] p-16 rounded-[5rem] border-4 border-[#ff7b00] shadow-3xl max-w-lg w-full">
            {gameMode === 'classic' ? (
              <>
                <h2 className={`text-4xl font-[1000] italic mb-4 uppercase tracking-tighter ${attempts.includes(targetNumber) ? 'text-green-400' : 'text-red-500'}`}>
                  {attempts.includes(targetNumber) ? 'BİLDİN TEBRİKLER! 🏆' : 'KAYBETTİN! 💀'}
                </h2>
                <div className="mb-8">
                  <span className="text-[10px] font-black text-white/40 block tracking-[0.5em] uppercase mb-2">DOĞRU CEVAP</span>
                  <span className="text-8xl font-[1000] text-white italic drop-shadow-2xl">{targetNumber}</span>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-black italic text-red-500 mb-2 uppercase tracking-tighter">OYUN BİTTİ</h2>
                <div className="mb-8">
                  <span className="text-[10px] font-black text-white/40 block tracking-[0.5em] uppercase mb-4">FİNAL SKORU</span>
                  <span className="text-[9rem] font-[1000] text-[#ff7b00] italic leading-none drop-shadow-2xl">{score}</span>
                </div>
                <div className={`mb-10 bg-white/5 p-6 rounded-3xl border border-white/10 ${getRankInfo(score).shadow} transition-all duration-500`}>
                  <span className="text-[10px] font-black text-white/40 block tracking-[0.2em] uppercase mb-2 text-center">ERİŞİLEN RÜTBE</span>
                  <p className={`text-4xl font-[1000] italic uppercase tracking-widest ${getRankInfo(score).color}`}>
                    {getRankInfo(score).title}
                  </p>
                </div>
              </>
            )}
            <button onClick={() => setGameState('lobby')} className="bg-white text-[#1a2c3d] w-full py-6 rounded-[2rem] font-[1000] text-2xl uppercase italic shadow-2xl hover:bg-[#ff7b00] hover:text-white transition-all active:scale-95">LOBİYE DÖN 🔄</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}