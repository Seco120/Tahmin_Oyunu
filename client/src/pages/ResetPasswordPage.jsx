import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const { resetToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => { document.body.style.overflowX = 'auto'; };
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    // 1. KURAL: Şifreler eşleşiyor mu?
    if (password !== confirmPassword) {
      return setStatus({ type: 'error', message: 'Şifreler eşleşmiyor kanka!' });
    }

    // 2. KURAL: Backend kuralına takılmamak için 6 karakter kontrolü
    if (password.length < 6) {
      return setStatus({ type: 'error', message: 'Şifre en az 6 karakter olmalı!' });
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await axios.put(`http://127.0.0.1:5000/api/auth/resetpassword/${resetToken}`, {
        password: password
      });

      if (res.data.success) {
        // Başarılı olunca sadece metni gösteriyoruz, pop-up yok!
        setStatus({ type: 'success', message: 'Şifre güncellendi! Giriş sayfasına uçuyorsun...' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      // Hata olunca da sadece metin basıyoruz
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Kodun süresi dolmuş veya geçersiz.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] w-full flex items-center justify-center px-4 font-['Montserrat'] overflow-x-hidden">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-br from-[#162a44]/95 to-[#0a192f]/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">YENİ ŞİFRE</h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Güvenliğin bizim için önemli 🔥</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-[#ff7b00] uppercase ml-1 mb-2 tracking-widest text-left">Yeni Şifre</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full h-14 px-5 rounded-2xl bg-white/5 text-white border border-white/10 outline-none focus:border-[#ff7b00] transition-all placeholder:text-white/20"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-[#ff7b00] uppercase ml-1 mb-2 tracking-widest text-left">Şifre Tekrar</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full h-14 px-5 rounded-2xl bg-white/5 text-white border border-white/10 outline-none focus:border-[#ff7b00] transition-all placeholder:text-white/20"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Sadece burada metin olarak gösteriyoruz, pop-up tetiklenmiyor */}
          {status.message && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`text-center text-[11px] font-black uppercase ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
            >
              {status.message}
            </motion.p>
          )}

          <button 
            disabled={loading}
            className="w-full h-14 bg-[#ff7b00] hover:bg-[#ff8c1a] text-white rounded-2xl font-[1000] uppercase shadow-lg shadow-[#ff7b00]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'İŞLENİYOR...' : 'ŞİFREYİ GÜNCELLE 🔥'}
          </button>
        </form>
      </motion.div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ff7b00]/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default ResetPasswordPage;