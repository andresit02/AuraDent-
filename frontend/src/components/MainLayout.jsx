import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // <--- Al ser vecinos en la misma carpeta, se importa así.

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // PROTECCIÓN DE RUTAS (Candado Global)
  useEffect(() => {
    if (!user || !token) {
      navigate('/');
    }
  }, [user, token, navigate]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* 1. MENÚ LATERAL FIJO */}
      <Sidebar />

      {/* 2. CONTENIDO DINÁMICO (A la derecha) */}
      {/* ml-64 empuja el contenido para no quedar debajo del menú */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen w-full">
        {/* Aquí se renderizará Dashboard, Pacientes, etc. */}
        <div className="max-w-7xl mx-auto animate-fade-in-down">
            {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;