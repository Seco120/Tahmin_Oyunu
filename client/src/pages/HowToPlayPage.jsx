import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const InfoCard = ({ title, desc, tip, icon, color, delay, side = "left" }) => (
  <motion.div 
    initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: delay }}
    viewport={{ once: true }}
    className={`flex items-center gap-6 md:gap-10 mb-10 ${side === "right" ? "flex-row-reverse text-right" : ""}`}
  >
    <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-3xl bg-[#162a44] border-2 border-white/10 flex items-center justify-center text-3xl md:text-4xl shadow-2xl">
      {icon}
    </div>

    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 flex-grow relative overflow-hidden group hover:border-[#ff7b00]/30 transition-all">
      <h4 className={`text-xl md:text-2xl font-[1000] uppercase italic mb-1 tracking-tighter ${color}`}>{title}</h4>
      <p className="text-gray-500 text-xs md:text-sm font-bold leading-relaxed mb-3">{desc}</p>
      
      <div className={`inline-block px-3 py-1.5 rounded-lg bg-gray-50 border-l-4 ${color.replace('text', 'border')}`}>
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter italic">💡 STRATEJİ: </span>
        <span className="text-[9px] font-black text-gray-500 uppercase">{tip}</span>
      </div>
    </div>
  </motion.div>
);

const RankStep = ({ rank, color, delay, score, icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    viewport={{ once: true }}
    className="bg-[#162a44] p-4 rounded-[1.5rem] border border-white/5 flex flex-col items-center text-center group hover:border-[#ff7b00] transition-all"
  >
    <span className="text-[14px] mb-1">{icon}</span>
    <span className={`text-sm font-[1000] italic uppercase mb-1 ${color}`}>{rank}</span>
    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{score}</span>
  </motion.div>
);

export default function HowToPlayPage() {
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    return () => { document.body.style.overflow = 'hidden'; };
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 font-['Montserrat'] bg-transparent">
      <div className="max-w-4xl mx-auto">
        
        {/* HERO HEADER */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-[1000] text-[#1a2c3d] tracking-tighter uppercase italic leading-[0.8]"
          >
            OYUN <br /> <span className="text-[#ff7b00]">REHBERİ</span>
          </motion.h1>
          <div className="w-20 h-2 bg-[#ff7b00] mx-auto mt-6 rounded-full" />
        </div>

        {/* 01. OYUN MODLARI */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-[1000] text-[#1a2c3d] uppercase italic tracking-tighter">01. OYUN MODLARI</h2>
            <div className="h-[2px] bg-[#1a2c3d]/10 flex-grow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-blue-500">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-[1000] text-blue-500 uppercase italic mb-2">KLASİK MOD</h3>
              <p className="text-gray-500 text-xs font-bold uppercase leading-relaxed">
                Bu modda sayı aralığını ve can miktarını tamamen siz belirlersiniz. Antrenman yapmak ve sınırlarınızı test etmek için tasarlanmıştır. Skor tablosuna puan aktarımı yapılmaz.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-red-500">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-[1000] text-red-500 uppercase italic mb-2">STREAK MODU</h3>
              <p className="text-gray-500 text-xs font-bold uppercase leading-relaxed">
                Rekabetçi moddur. Her başarılı tahminden sonra sayı aralığı genişler. Hata yapma şansınız yoktur; canınız bittiğinde seriniz sonlanır ve puanınız global sıralamaya işlenir.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 02. YETENEKLER */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8 flex-row-reverse">
            <h2 className="text-xl font-[1000] text-[#1a2c3d] uppercase italic tracking-tighter">02. ÖZEL YETENEKLER</h2>
            <div className="h-[2px] bg-[#1a2c3d]/10 flex-grow" />
          </div>
          
          <InfoCard 
            side="left"
            icon="🔍"
            title="Mercek"
            desc="Hedef sayının Tek mi yoksa Çift mi olduğunu analiz eder. Olasılıkları anında %50 oranında düşürür."
            tip="Yüksek sayı aralıklarında stratejik avantaj sağlar."
            color="text-yellow-500"
            delay={0.1}
          />
          
          <InfoCard 
            side="right"
            icon="📡"
            title="Scanner"
            desc="Sistemi tarayarak sayının birler basamağı, onlar basamağı veya genel büyüklük durumu hakkında rastgele bir veri sağlar."
            tip="Tahminleriniz tıkandığında Scanner kritik bir veri sunabilir."
            color="text-emerald-500"
            delay={0.2}
          />
        </section>

        {/* 03. RÜTBE SİSTEMİ */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-[1000] text-[#1a2c3d] uppercase italic tracking-tighter">03. RÜTBE SİSTEMİ</h2>
            <div className="h-[2px] bg-[#1a2c3d]/10 flex-grow" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <RankStep rank="Bronz" icon="🛡️" score="0-400" color="text-amber-700" delay={0.1} />
            <RankStep rank="Gümüş" icon="🥈" score="400-800" color="text-slate-400" delay={0.2} />
            <RankStep rank="Altın" icon="🏆" score="800-2000" color="text-[#ffd700]" delay={0.3} />
            <RankStep rank="Platin" icon="💠" score="2000-3500" color="text-[#e5e4e2]" delay={0.4} />
            <RankStep rank="Elmas" icon="💎" score="3500-5000" color="text-[#b9f2ff]" delay={0.5} />
            <RankStep rank="Usta" icon="👑" score="5000+" color="text-[#00ffff]" delay={0.6} />
          </div>
        </section>

        {/* 04. SIRALAMA VE PUANLAMA */}
        <section className="mb-24">
            <div className="bg-[#162a44] p-8 rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff7b00] to-transparent" />
                <h3 className="text-white font-[1000] italic uppercase text-2xl mb-4">PUANLAMA SİSTEMİ</h3>
                <p className="text-white/60 text-sm font-bold leading-relaxed max-w-2xl mx-auto uppercase tracking-wide">
                    Sadece Streak modunda kazanılan puanlar geçerlidir. Seviye ilerledikçe puan çarpanınız kalıcı olarak artış gösterir ve global liderlik tablosuna kaydedilir.
                </p>
            </div>
        </section>

        {/* ACTION BUTTON */}
        <div className="text-center">
          <Link to="/game">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#ff7b00] text-white px-12 py-5 rounded-[2rem] font-[1000] text-xl uppercase italic shadow-2xl shadow-[#ff7b00]/30 transition-all"
            >
              ARENAYA KATILIN 🔥
            </motion.button>
          </Link>
          <p className="mt-6 text-[#1a2c3d]/30 font-black uppercase tracking-[0.4em] text-[9px]">Liderlik koltuğunda yerinizi alın.</p>
        </div>
      </div>
    </div>
  );
}