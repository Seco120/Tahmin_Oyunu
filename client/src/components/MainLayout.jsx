import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main
        className="flex-1 flex flex-col items-center w-full relative"
        style={{
          /* Resmin zoomlanmasını engelleyen büyü: backgroundAttachment fixed */
          backgroundImage: "url('/arkaplan.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // 👈 Resim ekran boyutunda sabit kalır, içerikle büyümez.
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="w-full flex flex-col items-center pt-10 pb-32">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;