import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Register = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const images = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1488729122479-3db841106e4c?w=1600&h=900&fit=crop',
  ];

  useEffect(() => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBackgroundImage(randomImage);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Parolele nu coincid.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || data.message || 'A apărut o eroare la înregistrare.');
      } else {
        setSuccessMessage('Contul a fost creat cu succes. Poți să te loghezi acum.');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setErrorMessage('Nu s-a putut conecta la server. Încearcă din nou mai târziu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-24">
        <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-2xl sm:p-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">CREATE ACCOUNT</h1>
            <p className="mt-2 text-sm text-slate-600">
              Alătură-te comunității Smart Travel
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all duration-300 ease-in-out placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all duration-300 ease-in-out placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parola ta"
                className="w-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all duration-300 ease-in-out placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmă parola"
                className="w-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all duration-300 ease-in-out placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 py-3 px-4 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Se înregistrează...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Ai deja cont?{' '}
            <Link to="/login" className="font-semibold text-slate-900 hover:underline">
              Loghează-te
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
