import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop'
];

const Login = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    setBackgroundImage(BACKGROUND_IMAGES[randomIndex]);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); 
        
        localStorage.setItem('userEmail', email);

        if (data.userId) localStorage.setItem('userId', data.userId);
        else if (data.id) localStorage.setItem('userId', data.id); 

        let rolFinal = data.userRole || data.role; 
        
        if (!rolFinal) {
          if (email.toLowerCase().includes('admin')) {
            rolFinal = 'admin';
          } else {
            rolFinal = 'user';
          }
        }
        
        localStorage.setItem('userRole', rolFinal);
        
        console.log('Logare reușită! Te-ai logat cu rolul:', rolFinal);
        
        navigate('/dashboard'); 
        
        window.location.reload(); 
      } else {
        setError(data.message || 'Email sau parolă incorectă!');
      }
    } catch (err) {
      setError('Eroare: Nu mă pot conecta la server. Este pornit backend-ul?');
    }
  };

  return (
    <div 
      className="relative min-h-screen bg-slate-900 bg-cover bg-center transition-all duration-1000 flex items-center justify-center px-4" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay negru pentru contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Cardul de Login */}
      <div className="relative w-full max-w-md bg-white p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-t-[12px] border-slate-900">
        
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">SIGN IN</h1>
          <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Smart Travel Planner</p>
        </div>

        {/* Afisare eroare */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[11px] font-black border-l-4 border-red-600 uppercase tracking-widest">
            {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleLogin}>
          <div className="group">
            <label className="block text-[10px] font-black text-slate-900 mb-2 uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b-2 border-slate-100 py-3 text-sm focus:border-slate-900 outline-none transition-colors text-slate-900 bg-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-slate-900 mb-2 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b-2 border-slate-100 py-3 text-sm focus:border-slate-900 outline-none transition-colors text-slate-900 bg-transparent"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 py-5 text-[11px] font-black text-white tracking-[0.3em] hover:bg-black transition-all active:scale-95 shadow-2xl"
          >
            LOG IN
          </button>
        </form>

        <div className="mt-12 text-center border-t border-slate-100 pt-8">
          <Link 
            to="/register" 
            className="text-[10px] font-black text-slate-400 hover:text-slate-900 tracking-widest uppercase transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;