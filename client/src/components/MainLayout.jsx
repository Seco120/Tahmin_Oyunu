import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ARKA PLAN - Sabit div (Fixed yerine en garantisi budur) */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/arkaplan.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* İÇERİK KATMANI */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center w-full">
          {/* pt-4 md:pt-10: Mobilde header'a çok daha yakın.
            pb-10 md:pb-32: Alt boşluk mobilde daha insancıl.
            px-4: İçeriğin kenarlara sıfır yapışmasını engeller.
          */}
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center pt-4 md:pt-10 pb-10 md:pb-24 px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;