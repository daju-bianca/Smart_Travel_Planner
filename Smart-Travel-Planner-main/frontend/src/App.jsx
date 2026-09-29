import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminPanel from './components/AdminPanel'; 



const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [uniqueId] = useState(() => 'flight-' + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    
    checkToken(); 
    const interval = setInterval(checkToken, 500); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-70px)] w-full items-center justify-center overflow-hidden px-4 text-center">
      
      <style>{`
        @keyframes routeFade {
          0% { opacity: 0; }
          10% { opacity: 0.3; }
          85% { opacity: 0.3; }
          100% { opacity: 0; }
        }
        
        @keyframes planeOpacity {
          0% { opacity: 0; }
          5% { opacity: 1; }
          70% { opacity: 1; }
          75% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes pinAppearFade {
          0%, 74% { opacity: 0; transform: translateY(-20px) scale(0); }
          76% { opacity: 1; transform: translateY(5px) scale(1.2); }
          80% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes pinPulse {
          0%, 74% { opacity: 0; transform: scale(0.8); }
          75% { opacity: 0.6; transform: scale(0.8); }
          85% { opacity: 0; transform: scale(3); }
          100% { opacity: 0; }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
        
        <svg 
          key={uniqueId}
          className="w-full h-full absolute inset-0" 
          viewBox="0 0 1000 600" 
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            id={`route-${uniqueId}`}
            d="M -100,550 Q 400,100 900,280" 
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="3"
            strokeDasharray="12 12"
            style={{ opacity: 0, animation: 'routeFade 6s ease-in-out forwards' }}
          />

          <g transform="translate(900, 280)">
            <circle cx="0" cy="0" r="15" fill="#ef4444" style={{ opacity: 0, animation: 'pinPulse 6s ease-out forwards' }} />
            <path
              d="M0,0 C-12,-12 -18,-24 -18,-33 C-18,-43 -10,-51 0,-51 C10,-51 18,-43 18,-33 C18,-24 12,-12 0,0 Z M0,-38 C-2.8,-38 -5,-35.8 -5,-33 C-5,-30.2 -2.8,-28 0,-28 C2.8,-28 5,-30.2 5,-33 C5,-35.8 2.8,-38 0,-38 Z"
              fill="#ef4444"
              className="drop-shadow-2xl"
              style={{ opacity: 0, animation: 'pinAppearFade 6s ease-out forwards' }}
            />
          </g>

          <g style={{ opacity: 0, animation: 'planeOpacity 6s ease-in-out forwards' }}>
            <animateMotion
              dur="4.5s"
              fill="freeze"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.4 0 0.2 1"
              rotate="auto"
            >
              <mpath href={`#route-${uniqueId}`} />
            </animateMotion>
            
            <g transform="scale(1.8) translate(-12, -12) rotate(90, 12, 12)">
               <path 
                 fill="#ffffff" 
                 d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" 
                 className="drop-shadow-[0_4px_10px_rgba(255,255,255,0.4)]"
               />
            </g>
          </g>
        </svg>
      </div>

      <div className="relative z-10 rounded-2xl border border-white/10 bg-slate-900/40 p-8 md:p-12 shadow-2xl backdrop-blur-md max-w-3xl w-full mx-4">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-slate-300 font-bold">Smart Travel Planner</p>
        <h1 className="text-4xl font-black text-white md:text-5xl lg:text-6xl tracking-tighter leading-tight">
          PLANIFICĂ EXPERIENȚA TA <br className="hidden md:block"/> DE LUX CU STIL
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
          Descoperă destinații rafinate, itinerarii personalizate prin AI și o interfață premium creată pentru călătorii moderni.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          {isLoggedIn ? (
            <Link 
              to="/dashboard" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 flex items-center gap-2"
            >
              Spre Călătorie ➔
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-transparent border border-slate-500 hover:border-slate-300 text-slate-200 px-10 py-4 rounded-xl font-bold uppercase tracking-widest transition-all hover:bg-slate-800/50"
              >
                Autentificare
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105"
              >
                Cont Nou
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;