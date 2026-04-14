import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// INFO CARD - Mobilde daha esnek yapı
const InfoCard = ({ title, desc, tip, icon, color, delay, side = "left" }) => (
  <motion.div 
    initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: delay }}
    viewport={{ once: true }}
    className={`flex items-start md:items-center gap-4 md:gap-10 mb-8 ${side === "right" ? "flex-row-reverse text-right" : ""}`}
  >
    <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-3xl bg-[#162a44] border-2 border-white/10 flex items-center justify-center text-2xl md:text-4xl shadow-2xl">
      {icon}
    </div>

    <div className="bg-white/90 backdrop-blur-sm p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-gray-100 flex-grow relative overflow-hidden group hover:border-[#ff7b00]/30 transition-all">
      <h4 className={`text-lg md:text-2xl font-[1000] uppercase italic mb-1 tracking-tighter ${color}`}>{title}</h4>
      <p className="text-gray-500 text-[10px] md:text-sm font-bold leading-relaxed mb-3">{desc}</p>
      
      <div className={`inline-block px-2 py-1 rounded-lg bg-gray-50 border-l-4 ${color.replace('text', 'border')}`}>
        <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-tighter italic">💡 STRATEJİ: </span>
        <span className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase">{tip}</span>
      </div>
    </div>
  </motion.div>
);

// RANK STEP - Mobilde 3'lü veya 2'li grid için uygun
const RankStep = ({ rank, color, delay, score, icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    viewport={{ once: true }}
    className="bg-[#162a44] p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/5 flex flex-col items-center text-center group hover:border-[#ff7b00] transition-all"
  >
    <span className="text-[12px] md:text-[14px] mb-1">{icon}</span>
    <span className={`text-[10px] md:text-sm font-[1000] italic uppercase mb-1 ${color}`}>{rank}</span>
    <span className="text-[7px] md:text-[8px] font-bold text-white/40 uppercase tracking-widest">{score}</span>
  </motion.div>
);

export default function HowToPlayPage() {
  useEffect(() => {
    // Mobilde kaydırmayı açan kritik ayar
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    
    // Sayfadan çıkınca scroll'u sıfırla
    return () => { 
      document.body.style.overflow = 'auto'; 
    };
  }, []);

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 px-4 md:px-6 font-['Montserrat'] bg-transparent">
      <div className="max-w-4xl mx-auto">
        
        {/* HERO HEADER - Mobilde text-6xl'den 5xl'e çektik ki taşmasın */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-[1000] text-[#1a2c3d] tracking-tighter uppercase italic leading-[0.9]"
          >
            OYUN <br /> <span className="text-[#ff7b00]">REHBERİ</span>
          </motion.h1>
          <div className="w-16 h-2 bg-[#ff7b00] mx-auto mt-4 rounded-full" />
        </div>

        {/* 01. OYUN MODLARI */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-[1000] text-[#1a2c3d] uppercase italic tracking-tighter">01. OYUN MODLARI</h2>
            <div className="h-[1px] bg-[#1a2c3d]/10 flex-grow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border-b-4 md:border-b-8 border-blue-500">
              <div className="text-3xl md:text-4xl mb-3">🎯</div>
              <h3 className="text-xl md:text-2xl font-[1000] text-blue-500 uppercase italic mb-2">KLASİK MOD</h3>
              <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase leading-relaxed">
                Antrenman modudur. Sayı aralığını ve canı siz belirlersiniz. Skor tablosuna aktarım yapılmaz.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border-b-4 md:border-b-8 border-red-500">
              <div className="text-3xl md:text-4xl mb-3">⚡</div>
              <h3 className="text-xl md:text-2xl font-[1000] text-red-500 uppercase italic mb-2">STREAK MODU</h3>
              <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase leading-relaxed">
                Rekabetçi mod. Her doğru tahminde aralık genişler. Hata payı yoktur; puan sıralamaya işlenir.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 02. YETENEKLER */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-8 flex-row-reverse">
            <h2 className="text-lg md:text-xl font-[1000] text-[#1a2c3d] uppercase italic tracking-tighter">02. YETENEKLER</h2>
            <div className="h-[1px] bg-[#1a2c3d]/10 flex-grow" />
          </div>
          
          <InfoCard 
            side="left" icon="🔍" title="Mercek" 
            desc="Sayı Tek mi Çift mi analiz eder. Olasılığı %50 düşürür."
            tip="Yüksek aralıklarda hayat kurtarır." color="text-yellow-500" delay={0.1}
          />
          
          <InfoCard 
            side="right" icon="📡" title="Scanner" 
            desc="Sistemi tarayarak basamaklar hakkında kritik veri sağlar."
            tip="Tıkandığınızda Scanner'a güvenin." color="text-emerald-500" delay={0.2}
          />
        </section>

        {/* 03. RÜTBE SİSTEMİ - Mobilde 3'lü grid yaptık */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-[1000] text-[#1a2c3d] uppercase italic tracking-tighter">03. RÜTBE SİSTEMİ</h2>
            <div className="h-[1px] bg-[#1a2c3d]/10 flex-grow" />
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            <RankStep rank="Bronz" icon="🛡️" score="0-400" color="text-amber-700" delay={0.1} />
            <RankStep rank="Gümüş" icon="🥈" score="400-800" color="text-slate-400" delay={0.2} />
            <RankStep rank="Altın" icon="🏆" score="800-2000" color="text-[#ffd700]" delay={0.3} />
            <RankStep rank="Platin" icon="💠" score="2000-3500" color="text-[#e5e4e2]" delay={0.4} />
            <RankStep rank="Elmas" icon="💎" score="3500-5000" color="text-[#b9f2ff]" delay={0.5} />
            <RankStep rank="Usta" icon="👑" score="5000+" color="text-[#00ffff]" delay={0.6} />
          </div>
        </section>

        {/* 04. PUANLAMA */}
        <section className="mb-20">
            <div className="bg-[#162a44] p-6 md:p-8 rounded-[2rem] border border-white/10 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff7b00] to-transparent" />
                <h3 className="text-white font-[1000] italic uppercase text-lg md:text-2xl mb-3">PUANLAMA SİSTEMİ</h3>
                <p className="text-white/60 text-[10px] md:text-sm font-bold leading-relaxed max-w-2xl mx-auto uppercase tracking-wide">
                    Sadece Streak modunda kazanılan puanlar geçerlidir. Seviye ilerledikçe çarpanınız artar.
                </p>
            </div>
        </section>

        {/* ACTION BUTTON */}
        <div className="text-center">
          <Link to="/game">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#ff7b00] text-white px-8 md:px-12 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-[1000] text-lg md:text-xl uppercase italic shadow-2xl shadow-[#ff7b00]/30 transition-all"
            >
              ARENAYA KATILIN 🔥
            </motion.button>
          </Link>
          <p className="mt-4 text-[#1a2c3d]/30 font-black uppercase tracking-[0.2em] text-[8px]">Liderlik koltuğunda yerinizi alın.</p>
        </div>
      </div>
    </div>
  );
}