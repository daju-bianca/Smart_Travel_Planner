import { useEffect, useMemo, useState } from 'react';

const Review = ({ traseu, onInapoi }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const [adminReplyTexts, setAdminReplyTexts] = useState({});
  const userRole = localStorage.getItem('userRole');

  const [allReviews, setAllReviews] = useState(() => {
    const recenziiSalvate = localStorage.getItem('travel_reviews');
    if (recenziiSalvate) {
      return JSON.parse(recenziiSalvate);
    }
    return [
      { id: 1, user: 'Ioana', city: 'Cluj-Napoca', rating: 5, comment: 'Localuri superbe!', date: '1 săptămână în urmă' },
      { id: 2, user: 'Radu', city: 'Cluj-Napoca', rating: 5, comment: 'Centrul istoric este foarte frumos.', date: '5 zile în urmă' }
    ];
  });

  const actualCity = traseu?.oras || (traseu?.title?.includes(' în ') ? traseu.title.split(' în ').pop() : traseu?.title) || 'Cluj-Napoca';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reviews');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setAllReviews(data.map((rev) => ({
              id: rev.id,
              user: rev.userName || rev.user || 'Anonim',
              city: rev.city || actualCity,
              rating: rev.rating || 0,
              comment: rev.comment || '',
              date: rev.date || 'Recent',
              adminReply: rev.adminReply || null
            })));
          }
        }
      } catch (error) {
        console.log('Backend unavailable, using mock data.');
      }
    };
    fetchReviews();
  }, [actualCity]);

  const filteredReviews = useMemo(() => {
    return allReviews.filter((rev) => rev.city.toLowerCase() === actualCity.toLowerCase());
  }, [allReviews, actualCity]);

  const averageRating = useMemo(() => {
    if (!filteredReviews.length) return '0.0';
    const total = filteredReviews.reduce((sum, item) => sum + (item.rating || 0), 0);
    return (total / filteredReviews.length).toFixed(1);
  }, [filteredReviews]);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    filteredReviews.forEach((rev) => {
      if (rev.rating >= 1 && rev.rating <= 5) counts[rev.rating - 1] += 1;
    });
    return counts;
  }, [filteredReviews]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setLoading(true);

    const newReview = { 
        id: Date.now(), 
        user: 'Tu', 
        city: actualCity, 
        rating: rating, 
        comment: comment.trim(), 
        date: 'Acum',
        adminReply: null
    };

    const reviewData = {
      userId: 1, 
      routeId: traseu?.id || 1, 
      rating: rating,
      comment: comment.trim(),
      city: actualCity,
      userName: 'Tu' 
    };

    try {
      const response = await fetch('http://localhost:3000/api/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.warn("Backend-ul a respins salvarea (Motiv: " + errorData.error + "). Trecem pe salvare locală!");
      } else {
        console.log("Salvat cu succes și în baza de date!");
      }
    } catch (error) { 
        console.error('Eroare conexiune cu backend-ul:', error); 
    }

    const listaNouaDeRecenzii = [newReview, ...allReviews];
    setAllReviews(listaNouaDeRecenzii); 
    localStorage.setItem('travel_reviews', JSON.stringify(listaNouaDeRecenzii));

    setComment(''); 
    setRating(5); 
    setHover(0); 
    setLoading(false);
  };

  // ==========================================
  // FUNCȚIA DE RĂSPUNS ADMIN
  // ==========================================
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

  return (
    <div className="fixed inset-0 z-[999] w-screen h-[100dvh] overflow-hidden font-sans bg-[#0f172a]">
      <style>{`
        @keyframes fadeInUI { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeInUI 0.8s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>

      <div className="relative inset-0 w-full h-full flex items-center justify-center animate-fade-in">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2056')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0f172a] via-transparent to-[#0f172a]" />

        <div className="relative z-10 w-full max-w-[1000px] h-[85vh] px-6 flex flex-col text-white">
          <div className="flex-shrink-0 mb-6 text-center mt-4">
            <p className="text-xs uppercase font-bold tracking-[0.4em] text-blue-400">FEEDBACK VIZITATOR</p>
            <h1 className="text-4xl font-black text-white tracking-tight">{actualCity}</h1>
          </div>

          <div className="flex-1 min-h-0 grid gap-6 lg:grid-cols-2">
            {/* STÂNGA */}
            <div className="flex flex-col gap-6">
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-[30px] flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Rating Mediu</span>
                  <div className="text-5xl font-black text-white mt-1">{averageRating}</div>
                </div>
                <div className="flex flex-col gap-1">
                  {[5, 4, 3, 2, 1].map((s, idx) => {
                    const procent = (distribution[4-idx]/Math.max(1, filteredReviews.length)) * 100;
                    return (
                      <div key={s} className="flex items-center gap-2 text-[10px]">
                        <span className="w-4 text-right opacity-50">{s}★</span>
                        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${procent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-[30px] flex-1 flex flex-col shadow-xl">
                 <h3 className="text-xl font-bold mb-4">Evaluare</h3>
                 <div className="flex gap-2 mb-6 text-3xl">
                    {[...Array(5)].map((_, i) => (
                      <button 
                        key={i} 
                        onMouseEnter={() => setHover(i + 1)} 
                        onMouseLeave={() => setHover(0)} 
                        onClick={() => setRating(i + 1)} 
                        className={`transition-transform active:scale-90 ${i + 1 <= (hover || rating) ? 'text-amber-400' : 'text-white/20'}`}
                      >
                        ★
                      </button>
                    ))}
                 </div>
                 <textarea 
                   value={comment} 
                   onChange={(e) => setComment(e.target.value)} 
                   placeholder="Cum a fost experiența ta?" 
                   className="w-full flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 resize-none" 
                 />
                 <button 
                   onClick={handleSubmit} 
                   disabled={loading || !comment.trim()} 
                   className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg transition-all"
                 >
                   {loading ? 'Se trimite...' : 'Trimite Recenzia'}
                 </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-[30px] flex flex-col min-h-0 shadow-xl">
               <div className="mb-4 flex justify-between items-end">
                  <h3 className="text-xl font-bold">Alte experiențe</h3>
                  <span className="text-xs text-blue-400">{filteredReviews.length} recenzii</span>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {filteredReviews.map(rev => (
                    <div key={rev.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col">
                      
                      {/* Antet recenzie */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm">{rev.user}</span>
                        <div className="flex text-amber-400 text-[10px]">
                          {[...Array(5)].map((_, i) => <span key={i} className={i < rev.rating ? 'opacity-100' : 'opacity-20'}>★</span>)}
                        </div>
                      </div>
                      
                      {/* Text recenzie */}
                      <p className="text-gray-400 text-xs italic mb-2">"{rev.comment}"</p>

                      {rev.adminReply && (
                         <div className="mt-2 p-3 bg-slate-900/60 border-l-2 border-blue-500 rounded-r-xl">
                           <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Răspuns Oficial</span>
                           <p className="text-xs text-slate-300">{rev.adminReply}</p>
                         </div>
                      )}

                      {!rev.adminReply && userRole === 'admin' && (
                         <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                           <input
                             type="text"
                             value={adminReplyTexts[rev.id] || ''}
                             onChange={(e) => setAdminReplyTexts(prev => ({...prev, [rev.id]: e.target.value}))}
                             placeholder="Scrie un răspuns oficial..."
                             className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                           />
                           <button
                             onClick={() => handleAdminReplySubmit(rev.id)}
                             disabled={!adminReplyTexts[rev.id]?.trim()}
                             className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
                           >
                             Răspunde
                           </button>
                         </div>
                      )}

                    </div>
                  ))}
               </div>

               <button 
                  onClick={() => { if (onInapoi) onInapoi(); }} 
                  className="mt-6 border border-white/20 bg-black/40 py-3 rounded-xl text-xs font-bold tracking-widest hover:bg-white/10 transition-colors uppercase"
               >
                 ← ÎNAPOI LA ITINERARIU
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;