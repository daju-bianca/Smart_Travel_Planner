import React, { useEffect } from 'react';

const TurFinalizatSplash = ({ onComplete, actualCity }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999999] bg-[#0f172a] flex items-center justify-center font-sans">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
      
      <div className="text-center px-4 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-8 bg-[#2563eb] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)]">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
          TUR FINALIZAT!
        </h1>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
          Sperăm că te-ai bucurat de vizita în <span className="font-bold text-white">{actualCity || "oraș"}</span>. Spune-ne cum a fost experiența ta!
        </p>
      </div>
    </div>
  );
};

export default TurFinalizatSplash;