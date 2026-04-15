import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const { resetToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Sayfa açıldığında sağa sola kaymayı engelle
    document.body.style.overflowX = 'hidden';
    return () => { document.body.style.overflowX = 'auto'; };
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setStatus({ type: 'error', message: 'Şifreler eşleşmiyor kanka!' });
    }

    if (password.length < 6) {
      return setStatus({ type: 'error', message: 'Şifre en az 6 karakter olmalı!' });
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await axios.put(`https://tahmin-oyunu-dket.onrender.com/api/auth/resetpassword/${resetToken}`, {
        password: password
      });

      if (res.data.success) {
        setStatus({ type: 'success', message: 'Şifre güncellendi! Giriş sayfasına uçuyorsun...' });
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Kodun süresi dolmuş veya geçersiz.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen lg:min-h-[calc(100vh-100px)] w-full flex items-center justify-center px-6 py-10 lg:p-4 font-['Montserrat'] overflow-x-hidden bg-[#0a192f]">
      
      {/* ARKA PLAN IŞIK EFEKTİ (Mobilde performansı korumak için blur ayarlandı) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-[#ff7b00]/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-gradient-to-br from-[#162a44]/95 to-[#0a192f]/95 backdrop-blur-md p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/10 relative z-10"
      >
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-[1000] text-white tracking-tighter uppercase italic leading-none">
            YENİ <span className="text-[#ff7b00]">ŞİFRE</span>
          </h2>
          <p className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-3">
            GÜVENLİĞİN BİZİM İÇİN ÖNEMLİ 🔥
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5 md:space-y-6">
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-[#ff7b00] uppercase ml-1 mb-2 tracking-[0.15em] text-left">
              Yeni Şifre
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              className="w-full h-13 md:h-15 px-5 rounded-xl md:rounded-2xl bg-white/5 text-white border border-white/10 outline-none focus:border-[#ff7b00] transition-all placeholder:text-white/10 text-sm md:text-base focus:bg-white/10"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-[#ff7b00] uppercase ml-1 mb-2 tracking-[0.15em] text-left">
              Şifre Tekrar
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={confirmPassword}
              className="w-full h-13 md:h-15 px-5 rounded-xl md:rounded-2xl bg-white/5 text-white border border-white/10 outline-none focus:border-[#ff7b00] transition-all placeholder:text-white/10 text-sm md:text-base focus:bg-white/10"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <AnimatePresence mode="wait">
            {status.message && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`text-center text-[10px] md:text-[11px] font-[1000] uppercase tracking-wide leading-relaxed ${
                  status.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {status.message}
              </motion.p>
            )}
          </AnimatePresence>

          <button 
            disabled={loading}
            type="submit"
            className="w-full h-13 md:h-15 bg-[#ff7b00] hover:bg-[#ff8c1a] text-white rounded-xl md:rounded-2xl font-[1000] text-xs md:text-sm uppercase shadow-lg shadow-[#ff7b00]/20 transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed tracking-[0.1em]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                İŞLENİYOR...
              </span>
            ) : (
              'ŞİFREYİ GÜNCELLE 🔥'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;