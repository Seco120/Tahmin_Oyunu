import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    /* overflow-x-hidden: Yatay kaymayı ve zoom-out tetikleyicilerini engeller */
    <div className="min-h-[100dvh] w-full max-w-[100vw] flex flex-col relative overflow-x-hidden bg-[#f4f7fa]">
      
      {/* ARKA PLAN - Sabit ve performanslı */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/arkaplan.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* İÇERİK KATMANI */}
      <div className="relative z-10 flex flex-col min-h-[100dvh] w-full">
        <Header />

        <main className="flex-1 flex flex-col w-full">
          {/* - items-center: Masaüstünde ortalar.
            - pt-2: Mobilde Header'a iyice yaklaştırdık (Uzaklık hissini bitirir).
            - px-2: Mobilde kenar boşluğunu azalttık ki içerik daha büyük görünsün.
          */}
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center pt-2 md:pt-10 pb-8 md:pb-24 px-2 md:px-4">
            
            {/* CHILDREN kapsayıcısı: Mobilde içeriği %100 genişliğe zorlar */}
            <div className="w-full flex flex-col items-center">
               {children}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;