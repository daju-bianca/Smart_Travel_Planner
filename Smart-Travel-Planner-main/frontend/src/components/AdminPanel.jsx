import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [allReviews, setAllReviews] = useState(() => {
    const recenziiSalvate = localStorage.getItem('travel_reviews');
    if (recenziiSalvate) {
      return JSON.parse(recenziiSalvate);
    }
    return [
      { id: 1, user: 'Ioana', city: 'Cluj-Napoca', rating: 5, comment: 'Localuri superbe!', date: '1 săptămână în urmă', adminReply: null },
      { id: 2, user: 'Radu', city: 'Cluj-Napoca', rating: 5, comment: 'Centrul istoric este foarte frumos.', date: '5 zile în urmă', adminReply: null }
    ];
  });
  
  const [adminReplyTexts, setAdminReplyTexts] = useState({});
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reviews');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setAllReviews(data.map((rev) => ({
              id: rev.id,
              user: rev.userName || rev.user || 'Anonim',
              city: rev.city || 'Locație Necunoscută',
              rating: rev.rating || 0,
              comment: rev.comment || '',
              date: rev.date || 'Recent',
              adminReply: rev.adminReply || null
            })));
          }
        }
      } catch (error) {
        console.log('Backend indisponibil în Admin Panel. Folosim datele locale.');
      }
    };
    fetchReviews();
  }, [userRole, navigate]);

  const handleAdminReplySubmit = (reviewId) => {
    const replyText = adminReplyTexts[reviewId];
    if (!replyText?.trim()) return;

    const updatedReviews = allReviews.map(r => 
      r.id === reviewId ? { ...r, adminReply: replyText.trim() } : r
    );

    setAllReviews(updatedReviews);
    localStorage.setItem('travel_reviews', JSON.stringify(updatedReviews));
    setAdminReplyTexts(prev => ({ ...prev, [reviewId]: '' }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-24 pb-12 px-6 bg-[#0f172a]">
      {/* IMAGINEA DE FUNDAL */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2056')" }}
      />
      
      {/* GRADIENTUL PENTRU LIZIBILITATE */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0f172a]/20 via-[#0f172a]/60 to-[#0f172a]/90" />

      {/* CERCUL LUMINOS DECORATIV */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HEADER-UL PANOULUI */}
        <div className="flex justify-between items-end mb-8 border-b border-slate-700/50 pb-4">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Admin Dashboard</h1>
                <p className="text-slate-400 mt-2">Gestionează feedback-ul vizitatorilor din toate orașele.</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg font-bold border border-blue-500/30">
                    {allReviews.length} Recenzii
                </div>
                
                <button
                    onClick={handleLogout}
                    className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold border border-red-500/50 transition-all uppercase tracking-widest text-sm"
                >
                    Log Out
                </button>
            </div>
        </div>

        {/* LISTA DE RECENZII */}
        <div className="space-y-6">
          {allReviews.map(rev => (
            <div key={rev.id} className="bg-slate-900/60 border border-slate-700/50 p-6 rounded-3xl shadow-xl flex flex-col backdrop-blur-md">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="font-bold text-lg text-white">{rev.user || 'Anonim'}</span>
                    <span className="text-slate-500 text-sm ml-2 bg-slate-800/50 px-2 py-1 rounded">
                        📍 {rev.city || 'Locație Necunoscută'}
                    </span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < (rev.rating || 5) ? 'opacity-100' : 'opacity-20'}>★</span>
                  ))}
                </div>
              </div>
              
              <p className="text-slate-300 italic mb-4 text-lg">"{rev.comment}"</p>

              {/* Raspuns Existent */}
              {rev.adminReply && (
                <div className="mt-2 p-4 bg-slate-950/80 border-l-4 border-blue-500 rounded-r-xl">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">Răspunsul tău oficial:</span>
                  <p className="text-sm text-slate-300">{rev.adminReply}</p>
                </div>
              )}

              {/* Casuta de Raspuns */}
              {!rev.adminReply && (
                <div className="mt-4 flex gap-3 border-t border-slate-700/50 pt-4">
                  <input
                    type="text"
                    value={adminReplyTexts[rev.id] || ''}
                    onChange={(e) => setAdminReplyTexts(prev => ({...prev, [rev.id]: e.target.value}))}
                    placeholder="Scrie un răspuns oficial vizibil pentru toți..."
                    className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={() => handleAdminReplySubmit(rev.id)}
                    disabled={!adminReplyTexts[rev.id]?.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-wider"
                  >
                    Răspunde
                  </button>
                </div>
              )}
            </div>
          ))}

          {allReviews.length === 0 && (
              <p className="text-center text-slate-500 py-12">Nu există nicio recenzie în sistem momentan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;