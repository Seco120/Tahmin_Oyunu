import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfanın dışarıdan kaymasını engellemek için kesin çözüm
    document.body.style.overflow = 'hidden';
    
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/users/leaderboard');
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
    /* pt-24 ve md:pt-32 ekleyerek Header'ın altında kalmasını engelledik. 
       overflow-y-hidden ile aşağı kaymayı tamamen kapattık.
    */
    <div className="fixed inset-0 w-full h-full overflow-y-hidden font-['Montserrat'] flex flex-col items-center pt-24 md:pt-32 px-4 select-none">
      
      {/* BAŞLIK ALANI */}
      <div className="relative z-50 text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase leading-none">
          SIRALAMA
        </h1>
        <p className="text-black/80 text-[10px] md:text-xs mt-1 font-black uppercase tracking-[0.3em]">
          TOP 5 OYUNCU 🔥
        </p>
      </div>

      {/* LİSTE KONTEYNERİ */}
      <div className="relative w-full max-w-2xl z-40">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#ff7b00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#2c4e7a]/98 via-[#162a44]/98 to-[#010c1d]/98 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/10 p-4 md:p-6"
          >
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {leaders.map((player, index) => {
                  const rank = getUserRank(player.highScore);
                  return (
                    <motion.div
                      key={player._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between px-5 py-3 rounded-2xl border transition-all bg-white/5 ${rank.border} ${rank.shadow}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-sm md:text-lg font-black w-5 ${index === 0 ? 'text-[#ff7b00]' : 'text-white/20'}`}>
                          {index + 1}
                        </span>
                        
                        <div className="flex flex-col leading-tight">
                          <span className="text-white font-black uppercase tracking-wider text-xs md:text-sm">
                            {player.username}
                          </span>
                          <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${rank.color}`}>
                            {rank.title}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right leading-tight">
                        <span className={`text-lg md:text-2xl font-black tracking-tighter ${rank.color}`}>
                          {player.highScore.toLocaleString()}
                        </span>
                        <p className="text-[8px] text-white/30 font-black uppercase">PUAN</p>
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
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-black/50 text-[8px] font-black uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
          VERİLER GÜNCEL
        </div>
        
        <Link 
          to="/" 
          className="bg-black/10 hover:bg-black/20 px-8 py-2.5 rounded-full text-black font-black uppercase text-[10px] tracking-widest transition-all"
        >
          ← ANA MENÜYE DÖN
        </Link>
      </div>
    </div>
  );
};

export default LeaderboardPage;