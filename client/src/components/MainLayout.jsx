import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    /* h-screen yerine min-h-[100dvh] kullanarak mobil tarayıcı yükseklik hatalarını çözdük */
    <div className="min-h-[100dvh] flex flex-col relative overflow-x-hidden">
      
      {/* ARKA PLAN - 'fixed' kalmalı ki scroll yapınca arka plan kaymasın, içerik kaysın */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/arkaplan.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          /* Mobilde performans için arka planı sabitledik */
          willChange: 'transform'
        }}
      />

      {/* İÇERİK KATMANI */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        <Header />

        <main className="flex-1 flex flex-col items-center w-full">
          {/* pt-4 md:pt-10: Mobilde header'a yakınlık ideal.
            pb-10 md:pb-24: Alt boşluk dengelendi.
            w-full: Mobilde taşma yapmaması için garantiye alındı.
          */}
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center pt-4 md:pt-10 pb-12 md:pb-24 px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;