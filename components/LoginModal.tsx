import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
   isOpen: boolean;
   onClose: () => void;
}

// En producción, vercel.json redirige /api a Render backend
// En desarrollo, vite.config.ts hace proxy a localhost:5000
const API_URL = '/api';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();

   if (!isOpen) return null;

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      // Sanitización básica de inputs
      const sanitizedUsername = username.trim();
      const sanitizedPassword = password.trim();

      // Validación de inputs
      if (!sanitizedUsername || !sanitizedPassword) {
         setError('Por favor complete todos los campos');
         return;
      }

      if (sanitizedUsername.length < 3 || sanitizedUsername.length > 50) {
         setError('Usuario inválido');
         return;
      }

      if (sanitizedPassword.length < 6) {
         setError('Contraseña demasiado corta');
         return;
      }

      // Prevenir caracteres especiales que podrían usarse en inyección
      if (!/^[a-zA-Z0-9_-]+$/.test(sanitizedUsername)) {
         setError('Usuario contiene caracteres no permitidos');
         return;
      }

      try {
         const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
               username: sanitizedUsername, 
               password: sanitizedPassword 
            })
         });

         if (response.ok) {
            const data = await response.json();
            console.log('✅ Login response:', data);
            
            // Validar token antes de guardar
            if (!data.token || data.token.split('.').length !== 3) {
               console.error('❌ Invalid token received:', data);
               setError('Error: Token inválido recibido');
               return;
            }

            console.log('✅ Saving token to localStorage...');
            // Guardar token en localStorage
            localStorage.setItem('geodas_auth', data.token);
            console.log('✅ Token saved:', localStorage.getItem('geodas_auth') ? 'SUCCESS' : 'FAILED');
            
            // Cerrar modal primero
            onClose();
            
            // Pequeño delay para asegurar que el token se guardó
            setTimeout(() => {
               console.log('✅ Navigating to /admin...');
               navigate('/admin');
               // Force re-render - React Router manejará el cambio
               window.location.href = '/#/admin';
            }, 100);
         } else {
            const errorData = await response.json();
            
            // Manejar diferentes códigos de error
            if (response.status === 429) {
               setError('Demasiados intentos. Por favor espere 15 minutos.');
            } else if (response.status === 400) {
               setError('Datos inválidos');
            } else {
               setError(errorData.message || 'Credenciales incorrectas');
            }
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