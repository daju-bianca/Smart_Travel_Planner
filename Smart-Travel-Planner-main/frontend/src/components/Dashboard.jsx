import { useState, useRef } from 'react';
import Harta from './Map.jsx'; 
import Review from './Review.jsx'; 
import TurFinalizatSplash from './TurFinalizatSplash.jsx'; 

const Dashboard = () => {
  const [ecran, setEcran] = useState('formular'); 
  const [oras, setOras] = useState('');
  const [dorinta, setDorinta] = useState('');
  const [traseuSalvat, setTraseuSalvat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [traseuInDesfasurare, setTraseuInDesfasurare] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [cityCoords, setCityCoords] = useState(null);

  const promptRef = useRef(null);

  const metaData = [
    { fact: "O locație emblematică pentru istoria locală.", durata: "45 min" },
    { fact: "Adăpostește exponate rare și o arhitectură deosebită.", durata: "1h 15min" },
    { fact: "Un loc perfect pentru a admira atmosfera orașului.", durata: "30 min" },
    { fact: "Recent restaurat, acest loc ascunde legende fascinante.", durata: "1h" },
    { fact: "Un punct de belvedere excelent pentru fotografii superbe.", durata: "20 min" }
  ];

  const renderSafe = (data) => {
    if (!data) return "";
    if (typeof data === 'object') return data.nume_locatie || data.nume || "Locație selectată";
    return String(data);
  };

  const calculeazaTransport = (loc1, loc2) => {
    if (!loc1 || !loc2) return null;
    const parse = (c) => {
      if (!c) return null;
      if (typeof c === 'number') return c;
      const p = parseFloat(String(c).replace(',', '.'));
      return isNaN(p) ? null : p;
    };
    const lat1 = parse(loc1.lat || loc1.latitudine || loc1.latitude);
    const lon1 = parse(loc1.lng || loc1.longitudine || loc1.longitude);
    const lat2 = parse(loc2.lat || loc2.latitudine || loc2.latitude);
    const lon2 = parse(loc2.lng || loc2.longitudine || loc2.longitude);

    if (!lat1 || !lon1 || !lat2 || !lon2) return "🗺️ Distanță necunoscută";

    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distantaKm = R * c;

    if (distantaKm < 1.5) {
      const minute = Math.max(2, Math.round((distantaKm / 5) * 60));
      return `🚶 Mers pe jos spre următoarea destinație (~${minute} min)`;
    } else {
      const minute = Math.max(5, Math.round((distantaKm / 20) * 60));
      return `🚌 Auto/Transport spre următoarea destinație (~${minute} min)`;
    }
  };

  const handlePromptChange = (e) => {
    setDorinta(e.target.value);
    if (promptRef.current) {
      promptRef.current.style.height = 'auto'; 
      promptRef.current.style.height = `${Math.min(promptRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleGenerare = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${oras}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCityCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      })
      .catch(err => console.log("Eroare radar:", err));

    try {
      const raspuns = await fetch('http://localhost:3000/api/routes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oras, prompt_used: dorinta, places: [] }),
      });
      const data = await raspuns.json();
      if (raspuns.ok) {
        setTraseuSalvat({ ...data.route, oras });
        setEcran('detalii');
        setCurrentStep(0);
        setTraseuInDesfasurare(false);
      }
    } catch (error) {
      alert("Conexiunea cu serverul a fost întreruptă.");
    } finally {
      setLoading(false);
    }
  };

  const handleUrmatoareaLocatie = (indexCurent) => {
    if (traseuSalvat && traseuSalvat.places && indexCurent < traseuSalvat.places.length - 1) {
      setCurrentStep(indexCurent + 1);
    }
  };

  const handleFinalizeazaTurul = () => {
    setEcran('splash');
    setTraseuInDesfasurare(false);
    setCurrentStep(0);
  };

  const progres = traseuSalvat?.places && traseuSalvat.places.length > 1
    ? Math.round((currentStep / (traseuSalvat.places.length - 1)) * 100)
    : 0;

  const elegantScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-500 overflow-y-auto";

  return (
    <div className="relative h-[calc(100vh-70px)] w-full overflow-hidden bg-slate-950 text-slate-100">
      
      {/* -------------------------------------------------------------
          ECRANUL 1: DASHBOARD-UL CU HARTA 
          ------------------------------------------------------------- */}
      <div 
        className={`absolute inset-0 w-full h-full flex flex-col lg:flex-row transition-transform duration-1000 ease-in-out ${ecran === 'review' || ecran === 'splash' ? '-translate-y-full' : 'translate-y-0'}`}
      >
        {/* SIDEBAR STÂNGA */}
        <div className="w-full lg:w-[400px] bg-slate-900 shadow-2xl z-10 flex flex-col border-r border-slate-700 h-full">

          <div className="bg-slate-800 px-6 py-5 flex items-center justify-between border-b border-slate-700">
            <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="animate-pulse text-blue-400">✨</span> AI Travel Assistant
            </h2>
          </div>

          {traseuInDesfasurare && ecran === 'detalii' && (
            <div className="px-6 py-3 bg-slate-800/40 border-b border-slate-700">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                <span>Traseu în progres</span>
                <span className="text-blue-400">{progres}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-700 ease-in-out" style={{ width: `${progres}%` }}></div>
              </div>
            </div>
          )}

          <div className={`flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50 ${elegantScrollbar}`}>
            
            {ecran === 'formular' && (
              <div className="bg-slate-800 border border-slate-700 text-slate-300 p-5 rounded-2xl rounded-tl-none shadow-sm text-sm leading-relaxed">
                Salut! Sunt asistentul tău specializat în atracții turistice. Spune-mi un oraș și îți voi pune pe hartă cele mai importante monumente și muzee!
              </div>
            )}

            {ecran === 'detalii' && traseuSalvat && (
              <div className="bg-slate-800 border border-slate-700 text-slate-300 p-5 rounded-2xl rounded-tl-none shadow-sm text-sm leading-relaxed">
                <strong className="text-white text-base block mb-4 border-b border-slate-700 pb-2">
                  Itinerariu pentru {renderSafe(traseuSalvat?.oras) || oras}:
                </strong>
                
                <div className="space-y-3">
                  {traseuSalvat.places.map((place, index) => {
                    const isActive = index === currentStep && traseuInDesfasurare;
                    const isPast = index < currentStep && traseuInDesfasurare;

                    return (
                      <div key={index} className={`p-3 rounded-xl border transition-all ${isActive ? 'border-blue-500/50 bg-blue-500/10 shadow-lg' : 'border-slate-700 bg-slate-900/50'} ${isPast ? 'opacity-40' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isActive ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-700 text-slate-400'}`}>
                            {isPast ? '✓' : index + 1}
                          </div>
                          <span className={`font-bold text-sm ${isActive ? 'text-blue-300' : 'text-slate-300'}`}>
                            {renderSafe(place)}
                          </span>
                        </div>

                        {isActive && (
                          <div className="mt-4 pt-3 border-t border-blue-500/20 space-y-3">
                            <p className="text-xs text-slate-300 italic">💡 {metaData[index % metaData.length].fact}</p>
                            <div className="flex flex-col gap-2 pt-1">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                                🕒 Durată estimată: <span className="text-white">{metaData[index % metaData.length].durata}</span>
                              </span>
                              {index < traseuSalvat.places.length - 1 && (
                                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-tighter bg-emerald-900/20 p-2 rounded border border-emerald-500/20 mt-1">
                                  {calculeazaTransport(place, traseuSalvat.places[index + 1])}
                                </span>
                              )}
                            </div>
                            
                            {index === traseuSalvat.places.length - 1 ? (
                              <button 
                                onClick={handleFinalizeazaTurul}
                                className="mt-2 w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all"
                              >
                                Finalizează Turul
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUrmatoareaLocatie(index)}
                                className="mt-2 w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all"
                              >
                                Am ajuns la destinație ➔
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!traseuInDesfasurare ? (
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs tracking-widest uppercase py-3.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      onClick={() => setTraseuInDesfasurare(true)}
                    >
                      Confirmă & Începe Vizita
                    </button>
                    <button
                      className="w-full bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-300 font-bold text-xs tracking-widest uppercase py-3.5 px-4 rounded-xl transition-all"
                      onClick={() => { setTraseuSalvat(null); setEcran('formular'); }}
                    >
                      Generează Alt Itinerariu
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-4 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-2 px-4 rounded-xl transition-all font-bold text-sm"
                    onClick={handleFinalizeazaTurul}
                  >
                    Întrerupe Vizita
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Formular de Input */}
          <div className="p-5 bg-slate-900 border-t border-slate-700 mt-auto">
            {ecran === 'formular' && (
              <form onSubmit={handleGenerare} className="space-y-4">
                <input
                  type="text" value={oras} onChange={(e) => setOras(e.target.value)} placeholder="Spune-mi orașul..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 px-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all" required
                />
                <textarea
                  ref={promptRef}
                  rows="2" 
                  value={dorinta} 
                  onChange={handlePromptChange} 
                  placeholder="Detalii (ex: arhitectură, cafenele)..."
                  className={`w-full bg-slate-800 border border-slate-600 rounded-lg py-3 px-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all resize-none ${elegantScrollbar}`} required
                />
                {!loading ? (
                  <button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-all font-semibold shadow-md">
                    Generează Itinerariu
                  </button>
                ) : (
                  <div className="w-full bg-slate-700/50 text-slate-300 py-3 px-4 rounded-lg text-center font-bold animate-pulse">
                    Pregătim locațiile...
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/*  HARTA */}
        <div className="flex-1 bg-slate-900 relative p-4 h-full">
          <Harta 
            traseu={traseuSalvat} 
            currentStep={currentStep} 
            inDesfasurare={traseuInDesfasurare} 
            cityCoords={cityCoords}
          />
          
          <div className={`absolute top-8 right-8 z-[1000] pointer-events-none transition-all duration-700 ease-in-out ${traseuInDesfasurare ? 'opacity-0 -translate-y-5' : 'opacity-100 translate-y-0'}`}>
             <span className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full text-xs font-black text-blue-400 border border-blue-500/30 uppercase tracking-widest shadow-2xl flex max-w-[200px] md:max-w-[300px]">
                <span className="truncate">
                  {traseuSalvat ? `🎯 Destinație: ${renderSafe(traseuSalvat.oras) || oras}` : '📍 Aștept destinația...'}
                </span>
             </span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          ECRANUL 2: PAGINA DE RECENZIE
          ------------------------------------------------------------- */}
      <div 
        className={`absolute inset-0 w-full h-full bg-slate-950 overflow-hidden transition-transform duration-1000 ease-in-out ${ecran === 'review' || ecran === 'splash' ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <Review 
          traseu={traseuSalvat} 
          onInapoi={() => { setEcran('formular'); setTraseuSalvat(null); setOras(''); setDorinta(''); }} 
        />
      </div>

      {/* -------------------------------------------------------------
          ECRANUL 3: SPLASH-UL CU BIFA
          ------------------------------------------------------------- */}
      {ecran === 'splash' && (
        <TurFinalizatSplash 
          actualCity={traseuSalvat?.oras || oras} 
          onComplete={() => setEcran('review')}
        />
      )}

    </div>
  );
};

export default Dashboard;