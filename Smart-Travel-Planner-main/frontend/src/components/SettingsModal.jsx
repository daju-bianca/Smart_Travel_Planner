import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsModal = ({ isOpen, onClose }) => {
  const [numeNou, setNumeNou] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); 

  if (!isOpen) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Eroare: Nu ești logat corect (ID lipsă).");
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: numeNou }) 
      });
      
      const data = await response.json();
      if (data.success) {
        alert("Numele a fost actualizat cu succes!");
        setNumeNou('');
        onClose();
      }
    } catch (error) {
      alert("Eroare de conexiune la server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmare = window.confirm("Ești ABSOLUT sigur că vrei să ștergi contul? Acțiunea este ireversibilă!");
    if (!confirmare) return;

    try {
      const response = await fetch(`http://localhost:3000/api/users/delete/${userId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        
        alert("Contul a fost șters.");
        onClose();
        navigate('/'); 
      }
      else { alert("Eroare de la server: " + data.error); }
    } catch (error) {
      alert("Eroare la ștergerea contului.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 border-b border-slate-700 pb-4">
          Setări Cont
        </h2>

        <form onSubmit={handleUpdate} className="mb-8">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">
            Schimbă Numele
          </label>
          <input 
            type="text" 
            value={numeNou}
            onChange={(e) => setNumeNou(e.target.value)}
            placeholder="Introdu un nume nou..."
            className="w-full bg-slate-800 border border-slate-600 rounded-xl py-3 px-4 mb-4 text-white focus:border-blue-500 outline-none"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-widest"
          >
            {loading ? "Se salvează..." : "Actualizează Numele"}
          </button>
        </form>

        <div className="border-t border-red-500/20 pt-6">
          <h3 className="text-red-400 text-sm font-bold uppercase tracking-widest mb-2">Sigur vrei să faci asta ?</h3>
          <p className="text-slate-400 text-xs mb-4">
            Ștergerea contului va elimina permanent itinerariile și datele tale.
          </p>
          <button 
            onClick={handleDelete}
            className="w-full bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/50 hover:border-red-600 font-bold py-3 rounded-xl transition-all uppercase tracking-widest"
          >
            Șterge Contul
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;