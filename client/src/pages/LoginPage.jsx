import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import KidImage from '../assets/kid.png';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' }); 
  };

  const handleGuestLogin = () => {
    localStorage.setItem('isGuest', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setStatus({ 
      type: 'success', 
      message: "Misafir girişi yapıldı. Sadece Klasik Mod erişime açıktır." 
    });

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
      if (isForgotMode) {
        const response = await axios.post('https://tahmin-oyunu-dket.onrender.com/api/auth/forgotpassword', { 
          email: formData.email 
        });
        if (response.data.success) {
          setStatus({ 
            type: 'success', 
            message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderilmiştir." 
          });
          setTimeout(() => setIsForgotMode(false), 3000);
        }
      } else {
        const response = await axios.post('https://tahmin-oyunu-dket.onrender.com/api/auth/login', formData);
        
        if (response.data.success) {
          // 1. Önce misafir modunu temizle
          localStorage.removeItem('isGuest'); 
          
          // 2. Token ve User verisini kaydet
          localStorage.setItem('token', response.data.token);
          
          // KRİTİK NOKTA: Backend'den gelen user objesinin içinde avatar'ın 
          // olduğundan emin olarak kaydediyoruz.
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          setStatus({ 
            type: 'success', 
            message: "Giriş başarılı. Yönlendiriliyorsunuz..." 
          });
          
          // 3. Yönlendir ve Header'ın veriyi çekmesi için sayfayı tazeleyerek git
          setTimeout(() => {
            navigate('/'); 
            window.location.reload(); // Header'ın localStorage'dan taze veriyi çekmesini sağlar
          }, 1500);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Sistemde teknik bir hata oluştu.";
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full h-12 px-4 rounded-xl text-base font-medium bg-white/10 text-white border border-white/20 outline-none focus:border-[#ff7b00] focus:ring-1 focus:ring-[#ff7b00]/50 transition-all placeholder:text-white/30";
  const labelClasses = "text-xs font-black uppercase tracking-widest text-white mb-1 ml-1";

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden font-['Montserrat'] flex flex-col items-center pt-24 md:pt-32 px-4 bg-transparent">
      <div className="relative z-50 text-center mb-6 md:mb-10">
        <h1 className="text-4xl md:text-7xl font-black text-black tracking-tighter uppercase leading-none">
          {isForgotMode ? "ŞİFRE KURTARMA" : "TEKRAR HOŞ GELDİNİZ"}
        </h1>
        <p className="text-black/80 text-[10px] md:text-sm mt-2 font-black uppercase tracking-[0.25em]">
          {isForgotMode 
            ? "Lütfen kayıtlı e-posta adresinizi giriniz" 
            : "Kullanıcı bilgilerinizle sisteme giriş yapabilirsiniz"}
        </p>
      </div>

      <div className="relative w-full max-w-[850px] z-40">
        <div className="hidden lg:block absolute -right-24 bottom-0 z-50 pointer-events-none origin-bottom scale-125">
          <img src={KidImage} alt="Character" className="w-[450px] h-auto drop-shadow-[-20px_0px_30px_rgba(0,0,0,0.5)]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-br from-[#2c4e7a]/95 via-[#162a44]/95 to-[#010c1d]/95 backdrop-blur-md p-6 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 relative"
        >
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col">
                <label className={labelClasses}>
                  {isForgotMode ? "E-Posta Adresi" : "E-Posta veya Kullanıcı Adı"}
                </label>
                <input 
                  type="text" 
                  name="email" 
                  placeholder={isForgotMode ? "E-posta adresinizi yazınız..." : "E-posta veya kullanıcı adı..."} 
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
                      onClick={() => { setIsForgotMode(true); setStatus({type:'', message:''}); }}
                      className="text-[#ff7b00] text-[10px] font-black uppercase hover:underline"
                    >
                      Şifremi Unuttum?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Şifrenizi giriniz..." 
                    required 
                    className={inputClasses} 
                    onChange={handleChange} 
                  />
                </div>
              )}

              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-center p-3 rounded-xl text-[11px] font-black uppercase tracking-wider border ${
                      status.type === 'success' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                        : 'bg-red-500/20 text-red-400 border-red-500/50'
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
                  className="w-full h-14 bg-[#ff7b00] hover:bg-[#ff8c1a] text-white flex items-center justify-center gap-3 rounded-2xl shadow-xl transition-all uppercase font-black text-lg"
                >
                  {loading ? "İŞLEM YAPILIYOR..." : (isForgotMode ? "BAĞLANTI GÖNDER" : "GİRİŞ YAP")}
                </motion.button>

                {!isForgotMode && (
                  <>
                    <div className="relative flex items-center justify-center py-2">
                      <div className="flex-grow border-t border-white/10"></div>
                      <span className="flex-shrink mx-4 text-white/20 text-[9px] font-black uppercase tracking-widest">VEYA</span>
                      <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleGuestLogin}
                      className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center gap-3 rounded-xl transition-all uppercase font-black text-xs tracking-tight"
                    >
                      <span>🎮</span> MİSAFİR OLARAK OYNA
                    </motion.button>
                  </>
                )}

                {isForgotMode && (
                  <button 
                    type="button" 
                    onClick={() => { setIsForgotMode(false); setStatus({type:'', message:''}); }}
                    className="w-full text-white/50 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all"
                  >
                    Geri Dön
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {!isForgotMode && (
        <div className="mt-8 z-50">
          <Link to="/register" className="text-black/70 hover:text-black font-black uppercase transition-colors text-sm border-b-2 border-transparent hover:border-[#ff7b00]">
            Henüz hesabınız yok mu? Kayıt Olun 👉
          </Link>
        </div>
      )}
    </div>
  );
}