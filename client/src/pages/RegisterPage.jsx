import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import KidImage from '../assets/kid.png';

const RegisterPage = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (isForgotPassword) {
      try {
        await axios.post('https://tahmin-oyunu-dket.onrender.com/api/auth/forgotpassword', { 
          email: formData.email 
        });
        setStatus({ type: 'success', message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderilmiştir." });
        setTimeout(() => setIsForgotPassword(false), 3000);
      } catch (err) {
        const msg = err.response?.data?.message || "E-posta gönderimi sırasında bir hata oluştu.";
        setStatus({ type: 'error', message: msg });
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setStatus({ type: 'error', message: "Girilen şifreler birbiriyle uyuşmuyor." });
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setStatus({ type: 'error', message: "Şifreniz güvenlik gereği en az 6 karakterden oluşmalıdır." });
        setLoading(false);
        return;
      }

      try {
        const { username, email, password } = formData;
        const response = await axios.post('https://tahmin-oyunu-dket.onrender.com/api/auth/register', {
          username,
          email,
          password
        });

        if (response.data.success) {
          setStatus({ type: 'success', message: "Kaydınız başarıyla tamamlandı. Giriş sayfasına yönlendiriliyorsunuz..." });
          
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          
          setTimeout(() => {
            navigate('/login');
          }, 2500);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Kayıt işlemi sırasında teknik bir hata oluştu.";
        setStatus({ type: 'error', message: errorMsg });
      }
    }
    setLoading(false);
  };

  const inputClasses = "w-full h-10 px-4 rounded-xl text-base font-medium bg-white/10 text-white border border-white/20 outline-none focus:border-[#ff7b00] focus:ring-1 focus:ring-[#ff7b00]/50 transition-all placeholder:text-white/30";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-white mb-1 ml-1 opacity-70";

  return (
    /* h-[100dvh] ve overflow-hidden ile aşağı kaymayı (scroll) tamamen iptal ettik */
    /* pt-12 (mobil) ve pt-20 (masaüstü) ile Header'a iyice yaklaştırdık */
    <div className="h-[100dvh] w-full font-['Montserrat'] flex flex-col items-center justify-start pt-12 md:pt-12 px-4 bg-transparent overflow-hidden">
      
      {/* BAŞLIK - Margin azaltılarak yukarı çekildi */}
      <div className="relative z-50 text-center mb-6 md:mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-6xl font-black text-[#1a2c3d] tracking-tighter uppercase leading-none italic"
        >
          {isForgotPassword ? "ŞİFRE SIFIRLAMA" : "KAYIT OL – OYUNA KATIL!"}
        </motion.h1>
        <p className="text-[#ff7b00] text-[9px] md:text-sm mt-1 font-black uppercase tracking-[0.25em]">
          {isForgotPassword ? "E-posta adresinizi giriniz 🛡️" : "Tahmin gücünü göster, liderliğe yüksel 🔥"}
        </p>
      </div>

      <div className="relative w-full max-w-[850px] z-40">
        {/* CHARACTER IMAGE - Login ile uyumlu pozisyon */}
        <motion.div 
          animate={{ x: isForgotPassword ? 20 : 0 }}
          className="hidden lg:block absolute -right-24 bottom-0 z-50 pointer-events-none origin-bottom scale-125"
        >
          <img src={KidImage} alt="Character" className="w-[450px] h-auto drop-shadow-[-20px_0px_30px_rgba(0,0,0,0.5)]" />
        </motion.div>

        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-br from-[#2c4e7a]/95 via-[#162a44]/95 to-[#010c1d]/95 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 relative"
        >
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-3">
              
              <AnimatePresence mode="wait">
                {!isForgotPassword ? (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="flex flex-col">
                      <label className={labelClasses}>Kullanıcı Adı</label>
                      <input type="text" name="username" value={formData.username} placeholder="Kullanıcı adınız..." required className={inputClasses} onChange={handleChange} />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className={labelClasses}>E-Posta Adresi</label>
                      <input type="email" name="email" value={formData.email} placeholder="E-posta adresin..." required className={inputClasses} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className={labelClasses}>Şifre</label>
                        <input type="password" name="password" value={formData.password} placeholder="******" required className={inputClasses} onChange={handleChange} />
                      </div>

                      <div className="flex flex-col">
                        <label className={labelClasses}>Şifre Tekrar</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="******" required className={inputClasses} onChange={handleChange} />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="forgot-fields"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 py-4"
                  >
                    <div className="flex flex-col">
                      <label className={labelClasses}>E-Posta Adresi</label>
                      <input type="email" name="email" value={formData.email} placeholder="Kayıtlı e-postanı yaz..." required className={inputClasses} onChange={handleChange} />
                    </div>
                    <p className="text-white/50 text-[10px] italic font-medium">
                      * Kayıtlı bir hesap varsa sıfırlama bağlantısı gönderilecektir.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DURUM BİLDİRİMİ */}
              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-2 rounded-xl text-[10px] font-black uppercase text-center border ${
                      status.type === 'success' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                      : 'bg-red-500/20 text-red-400 border-red-500/50'
                    }`}
                  >
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-[#ff7b00] hover:bg-[#ff8c1a] text-white flex items-center justify-center gap-3 rounded-2xl shadow-xl transition-all uppercase font-black text-lg italic"
                >
                  {loading ? "İŞLENİYOR..." : (isForgotPassword ? "BAĞLANTI GÖNDER 🔥" : "KAYDI TAMAMLA 🔥")}
                </motion.button>

                <button 
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(!isForgotPassword);
                    setStatus({ type: '', message: '' });
                  }}
                  className="w-full mt-3 text-white/40 hover:text-[#ff7b00] text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  {isForgotPassword ? "← KAYIT EKRANINA DÖN" : "Şifremi Unuttum?"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 z-50">
        <Link to="/login" className="text-[#1a2c3d]/60 hover:text-[#ff7b00] font-black uppercase transition-colors text-xs border-b border-transparent hover:border-[#ff7b00] pb-1">
          Zaten bir hesabın var mı? Giriş Yap 👉
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;