import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import KidImage from '../assets/kid.png';

// API URL dinamik hale getirildi kanka 🚀
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://tahmin-oyunu-dket.onrender.com/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); 
  const navigate = useNavigate();

  // Mod değişince statusu sıfırla
  useEffect(() => {
    setStatus({ type: '', message: '' });
  }, [isForgotMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' }); 
  };

  const handleGuestLogin = () => {
    localStorage.setItem('isGuest', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setStatus({ type: 'success', message: "Misafir girişi yapıldı. Yönlendiriliyorsunuz..." });
    setTimeout(() => {
      navigate('/game');
      window.location.reload();
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const endpoint = isForgotMode ? '/auth/forgotpassword' : '/auth/login';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);
      
      if (response.data.success) {
        if (isForgotMode) {
          setStatus({ type: 'success', message: "Sıfırlama bağlantısı gönderildi! E-postanı kontrol et kanka." });
          // Formu temizle
          setFormData({ email: '', password: '' });
        } else {
          localStorage.removeItem('isGuest'); 
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setStatus({ type: 'success', message: "Giriş başarılı! Yönlendiriliyorsunuz..." });
          setTimeout(() => {
            navigate('/'); 
            window.location.reload(); 
          }, 1500);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Sunucuyla bağlantı kurulamadı kanka.";
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full h-12 px-4 rounded-xl text-base font-medium bg-white/10 text-white border border-white/20 outline-none focus:border-[#ff7b00] focus:ring-1 focus:ring-[#ff7b00]/50 transition-all placeholder:text-white/30";
  const labelClasses = "text-[10px] md:text-xs font-black uppercase tracking-widest text-white mb-1 ml-1";

  return (
    <div className="min-h-screen w-full font-['Montserrat'] flex flex-col items-center pt-16 md:pt-24 pb-10 px-4 bg-transparent overflow-x-hidden">
      
      {/* BAŞLIK */}
      <div className="relative z-50 text-center mb-8 md:mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-black text-[#1a2c3d] tracking-tighter uppercase leading-none italic"
        >
          {isForgotMode ? "ŞİFRE KURTARMA" : "TEKRAR HOŞ GELDİNİZ"}
        </motion.h1>
        <p className="text-[#ff7b00] text-[9px] md:text-sm mt-2 font-black uppercase tracking-[0.25em]">
          {isForgotMode ? "Lütfen kayıtlı e-posta adresinizi giriniz" : "Sisteme giriş yaparak maceraya devam edin"}
        </p>
      </div>

      <div className="relative w-full max-w-[850px] z-40">
        <div className="hidden lg:block absolute -right-24 bottom-0 z-50 pointer-events-none origin-bottom scale-125">
          <img src={KidImage} alt="Character" className="w-[450px] h-auto drop-shadow-[-20px_0px_30px_rgba(0,0,0,0.5)]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-br from-[#162a44]/95 via-[#0f1d31]/98 to-[#010c1d]/98 backdrop-blur-md p-6 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10"
        >
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col">
                <label className={labelClasses}>
                  {isForgotMode ? "E-Posta Adresi" : "E-Posta veya Kullanıcı Adı"}
                </label>
                <input 
                  type="text" 
                  name="email" 
                  value={formData.email}
                  placeholder="Kullanıcı adınız veya e-postanız" 
                  required 
                  className={inputClasses} 
                  onChange={handleChange} 
                />
              </div>

              {!isForgotMode && (
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className={labelClasses}>Şifre</label>
                    <button 
                      type="button"
                      onClick={() => setIsForgotMode(true)}
                      className="text-[#ff7b00] text-[9px] font-black uppercase hover:underline"
                    >
                      Şifremi Unuttum?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password}
                    placeholder="******" 
                    required 
                    className={inputClasses} 
                    onChange={handleChange} 
                  />
                </div>
              )}

              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`text-center p-3 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      status.type === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'
                    }`}
                  >
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2 space-y-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-[#ff7b00] hover:bg-[#ff8c1a] text-white flex items-center justify-center gap-3 rounded-2xl shadow-xl transition-all uppercase font-black text-lg italic disabled:opacity-50"
                >
                  {loading ? "BEKLEYİN..." : (isForgotMode ? "BAĞLANTI GÖNDER" : "GİRİŞ YAP")}
                </motion.button>

                {!isForgotMode && (
                  <>
                    <div className="relative flex items-center justify-center py-1">
                      <div className="flex-grow border-t border-white/10"></div>
                      <span className="flex-shrink mx-4 text-white/20 text-[9px] font-black uppercase tracking-widest">VEYA</span>
                      <div className="flex-grow border-t border-white/10"></div>
                    </div>
                    <motion.button 
                      type="button"
                      onClick={handleGuestLogin}
                      className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center gap-3 rounded-xl transition-all uppercase font-black text-[12px] tracking-tight"
                    >
                      🎮 MİSAFİR OLARAK DEVAM ET
                    </motion.button>
                  </>
                )}

                {isForgotMode && (
                  <button 
                    type="button" 
                    onClick={() => setIsForgotMode(false)}
                    className="w-full text-white/30 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all pt-2"
                  >
                    ← VAZGEÇ VE GERİ DÖN
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {!isForgotMode && (
        <div className="mt-8 z-50 text-center">
          <Link to="/register" className="text-[#1a2c3d]/60 hover:text-[#ff7b00] font-black uppercase transition-all text-xs border-b-2 border-transparent hover:border-[#ff7b00] pb-1">
            Hesabınız yok mu? Hemen Kayıt Olun
          </Link>
        </div>
      )}
    </div>
  );
}