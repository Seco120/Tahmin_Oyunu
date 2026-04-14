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
  const [status, setStatus] = useState({ type: '', message: '' }); // Bildirimler için yeni state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' }); // Yazmaya başlayınca hata mesajını kaldır
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (isForgotPassword) {
      // --- ŞİFRE SIFIRLAMA İŞLEMLERİ ---
      try {
        await axios.post('http://127.0.0.1:5000/api/auth/forgotpassword', { 
          email: formData.email 
        });
        setStatus({ type: 'success', message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderilmiştir." });
        setTimeout(() => setIsForgotPassword(false), 3000);
      } catch (err) {
        const msg = err.response?.data?.message || "E-posta gönderimi sırasında bir hata oluştu.";
        setStatus({ type: 'error', message: msg });
      }
    } else {
      // --- KAYIT İŞLEMLERİ ---
      
      // Şifre eşleşme kontrolü
      if (formData.password !== formData.confirmPassword) {
        setStatus({ type: 'error', message: "Girilen şifreler birbiriyle uyuşmuyor." });
        setLoading(false);
        return;
      }

      // Şifre uzunluk kontrolü (opsiyonel ama önerilir)
      if (formData.password.length < 6) {
        setStatus({ type: 'error', message: "Şifreniz güvenlik gereği en az 6 karakterden oluşmalıdır." });
        setLoading(false);
        return;
      }

      try {
        const { username, email, password } = formData;
        const response = await axios.post('http://127.0.0.1:5000/api/auth/register', {
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
          
          // Mesajın okunması için kısa bir bekleme ve yönlendirme
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
  const labelClasses = "text-xs font-black uppercase tracking-widest text-white mb-1 ml-1";

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden font-['Montserrat'] flex flex-col items-center pt-24 md:pt-32 px-4 bg-transparent">
      
      <div className="relative z-50 text-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-6xl font-black text-black tracking-tighter uppercase leading-none">
          {isForgotPassword ? "Şifre Sıfırlama" : "KAYIT OL – OYUNA KATIL!"}
        </h1>
        <p className="text-black/80 text-[10px] md:text-sm mt-2 font-black uppercase tracking-[0.25em]">
          {isForgotPassword ? "Lütfen sisteme kayıtlı e-posta adresinizi giriniz 🛡️" : "Tahmin gücünüzü gösterin 🔥 liderlik tablosuna adınızı yazdırın 🏆"}
        </p>
      </div>

      <div className="relative w-full max-w-[850px] z-40">
        <motion.div 
          animate={{ x: isForgotPassword ? 20 : 0 }}
          className="hidden lg:block absolute -right-24 bottom-0 z-50 pointer-events-none origin-bottom scale-125"
        >
          <img src={KidImage} alt="Character" className="w-[450px] h-auto drop-shadow-[-20px_0px_30px_rgba(0,0,0,0.5)]" />
        </motion.div>

        <motion.div 
          layout
          className="w-full bg-gradient-to-br from-[#2c4e7a]/95 via-[#162a44]/95 to-[#010c1d]/95 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 relative"
        >
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <AnimatePresence mode="wait">
                {!isForgotPassword ? (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col">
                      <label className={labelClasses}>Kullanıcı Adı</label>
                      <input type="text" name="username" value={formData.username} placeholder="Kullanıcı adınızı belirleyin..." required className={inputClasses} onChange={handleChange} />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className={labelClasses}>E-Posta Adresi</label>
                      <input type="email" name="email" value={formData.email} placeholder="E-posta adresiniz..." required className={inputClasses} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col">
                      <label className={labelClasses}>Şifre</label>
                      <input type="password" name="password" value={formData.password} placeholder="Şifreniz..." required className={inputClasses} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col">
                      <label className={labelClasses}>Şifre Tekrar</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="Şifrenizi tekrar yazın..." required className={inputClasses} onChange={handleChange} />
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
                      <input type="email" name="email" value={formData.email} placeholder="Kayıtlı e-posta adresinizi yazın..." required className={inputClasses} onChange={handleChange} />
                    </div>
                    <p className="text-white/50 text-[11px] italic font-medium">
                      * Sistemde kayıtlı bir hesap bulunması durumunda sıfırlama bağlantısı iletilecektir.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DURUM BİLDİRİMİ (Statik) */}
              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-3 rounded-xl text-[11px] font-black uppercase text-center border ${
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
                  className="w-full h-14 bg-[#ff7b00] hover:bg-[#ff8c1a] text-white flex items-center justify-center gap-3 rounded-2xl shadow-xl transition-all uppercase font-black text-lg"
                >
                  {loading ? "İŞLENİYOR..." : (isForgotPassword ? "BAĞLANTI GÖNDER 🔥" : "KAYDI TAMAMLA 🔥")}
                </motion.button>

                <button 
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(!isForgotPassword);
                    setStatus({ type: '', message: '' });
                  }}
                  className="w-full mt-4 text-white/60 hover:text-[#ff7b00] text-xs font-bold uppercase tracking-tighter transition-all"
                >
                  {isForgotPassword ? "← Kayıt Ekranına Dön" : "Şifremi Unuttum?"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 z-50">
        <Link to="/login" className="text-black/70 hover:text-black font-black uppercase transition-colors text-sm border-b-2 border-transparent hover:border-[#ff7b00]">
          Zaten bir hesabınız var mı? Giriş Yapın 👉
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;