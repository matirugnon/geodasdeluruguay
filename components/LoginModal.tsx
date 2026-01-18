import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
   isOpen: boolean;
   onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();

   if (!isOpen) return null;

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      try {
         const response = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
         });

         if (response.ok) {
            const data = await response.json();
            // Guardar el token JWT real en localStorage
            localStorage.setItem('geodas_auth', data.token);
            onClose();
            navigate('/admin');
            window.location.reload(); // Ensure admin state updates globally
         } else {
            const errorData = await response.json();
            setError(errorData.message || 'Credenciales incorrectas');
         }
      } catch (error) {
         console.error('Error en login:', error);
         setError('Error al conectar con el servidor');
      }
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
         {/* Overlay */}
         <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
         ></div>

         {/* Modal Content */}
         <div className="relative w-full max-w-md bg-stone-50/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-8 transform transition-all scale-100">
            <button
               onClick={onClose}
               className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
            >
               <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <span className="material-symbols-outlined text-primary text-2xl">lock</span>
               </div>
               <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-white">Acceso Restringido</h2>
               <p className="text-sm text-stone-500 mt-2">Área exclusiva para staff y administración.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
               <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Usuario</label>
                  <input
                     type="text"
                     value={username}
                     onChange={e => setUsername(e.target.value)}
                     className="w-full rounded-xl border-stone-200 bg-white/50 focus:bg-white focus:border-primary focus:ring-primary transition-all p-3 text-stone-800"
                     placeholder="Nombre de usuario"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Contraseña</label>
                  <input
                     type="password"
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     className="w-full rounded-xl border-stone-200 bg-white/50 focus:bg-white focus:border-primary focus:ring-primary transition-all p-3 text-stone-800"
                     placeholder="••••••••"
                  />
               </div>

               {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

               <button
                  type="submit"
                  className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]"
               >
                  Ingresar al Panel
               </button>
            </form>
         </div>
      </div>
   );
};