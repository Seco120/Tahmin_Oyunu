import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfanın genel kaymasını yönet ama kilitleme
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('https://tahmin-oyunu-dket.onrender.com/api/users/leaderboard');
        if (res.data.success) {
          setLeaders(res.data.data);
        }
      } catch (err) {
        console.error("Sıralama verisi alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();

    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const getUserRank = (score) => {
    const s = score;
    if (s >= 5000) return { title: "USTA 👑", color: "text-[#00ffff]", shadow: "shadow-[0_0_25px_rgba(0,255,255,0.4)]", border: "border-[#00ffff]/50" };
    if (s >= 3500) return { title: "ELMAS 💎", color: "text-[#b9f2ff]", shadow: "shadow-[0_0_20px_rgba(185,242,255,0.3)]", border: "border-[#b9f2ff]/30" };
    if (s >= 2000) return { title: "PLATİN 💠", color: "text-[#e5e4e2]", shadow: "", border: "border-white/20" };
    if (s >= 800) return { title: "ALTIN 🏆", color: "text-[#ffd700]", shadow: "", border: "border-[#ffd700]/20" };
    if (s >= 400) return { title: "GÜMÜŞ 🥈", color: "text-[#c0c0c0]", shadow: "", border: "border-white/10" };
    return { title: "BRONZ 🛡️", color: "text-amber-700", shadow: "", border: "border-white/5" };
  };

  return (
    /* fixed inset-0 kaldırıldı, min-h-screen ve flex-col eklendi */
    <div className="min-h-screen w-full font-['Montserrat'] flex flex-col items-center pt-24 md:pt-0 pb-10 px-4 select-none bg-transparent">
      
      {/* BAŞLIK ALANI - Mobilde text boyutu optimize edildi */}
      <div className="relative z-50 text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-[#1a2c3d] tracking-tighter uppercase leading-none italic"
        >
          SIRALAMA
        </motion.h1>
        <p className="text-[#ff7b00] text-[10px] md:text-xs mt-2 font-black uppercase tracking-[0.4em]">
          TOP 5 OYUNCU 🔥
        </p>
      </div>

      {/* LİSTE KONTEYNERİ */}
      <div className="relative w-full max-w-2xl z-40 px-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-[#ff7b00] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-black uppercase text-[#1a2c3d]/40">Liderler Getiriliyor...</span>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#162a44]/95 via-[#0f1d31]/98 to-[#010c1d]/98 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 p-4 md:p-8"
          >
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {leaders.map((player, index) => {
                  const rank = getUserRank(player.highScore);
                  return (
                    <motion.div
                      key={player._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between px-4 md:px-6 py-4 rounded-2xl border transition-all bg-white/5 hover:bg-white/10 ${rank.border} ${rank.shadow}`}
                    >
                      <div className="flex items-center gap-3 md:gap-5">
                        <span className={`text-xl md:text-2xl font-black w-6 text-center ${index === 0 ? 'text-[#ff7b00]' : 'text-white/20'}`}>
                          {index + 1}
                        </span>
                        
                        <div className="flex flex-col leading-tight">
                          <span className="text-white font-black uppercase tracking-wider text-sm md:text-base">
                            {player.username}
                          </span>
                          <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-widest ${rank.color}`}>
                            {rank.title}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right leading-tight">
                        <span className={`text-xl md:text-3xl font-[1000] tracking-tighter ${rank.color}`}>
                          {player.highScore.toLocaleString()}
                        </span>
                        <p className="text-[7px] md:text-[9px] text-white/30 font-black uppercase">PUAN</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* FOOTER BÖLÜMÜ */}
      <div className="mt-10 flex flex-col items-center gap-6 pb-10">
        <div className="flex items-center gap-2 text-[#1a2c3d]/50 text-[9px] font-black uppercase tracking-[0.3em]">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
          VERİLER ANLIK GÜNCELLENİYOR
        </div>
        
        <Link 
          to="/" 
          className="bg-[#1a2c3d] hover:bg-[#ff7b00] px-10 py-4 rounded-2xl text-white font-black uppercase text-[11px] tracking-widest transition-all shadow-xl active:scale-95"
        >
          ← ANA MENÜYE DÖN
        </Link>
      </div>
    </div>
  );
};

export default LeaderboardPage;