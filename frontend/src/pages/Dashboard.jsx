import { useNavigate } from 'react-router-dom';
import { logoutUsuario } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Recuperamos el nombre del usuario guardado en el login
  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Doctor' };

  const handleLogout = () => {
    logoutUsuario(); // Borra el token
    navigate('/');   // Nos manda al Login de nuevo
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- SIDEBAR (Barra Lateral) --- */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600">AuraDent 🦷</h2>
          <p className="text-sm text-gray-500">Panel Administrativo</p>
        </div>
        
        <nav className="mt-6">
          <a href="#" className="flex items-center px-6 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600">
            <span className="font-semibold">🏠 Inicio</span>
          </a>
          <button onClick={() => alert("Próximamente: Módulo Pacientes")} className="w-full text-left flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition">
            <span>👥 Pacientes</span>
          </button>
          <button onClick={() => alert("Próximamente: Módulo Fichas")} className="w-full text-left flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition">
            <span>📋 Fichas Técnicas</span>
          </button>
          <button onClick={() => alert("Próximamente: Odontograma")} className="w-full text-left flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition">
            <span>🦷 Odontograma</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:text-red-700 font-semibold"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bienvenido, Dr/a. {user.nombre}</h1>
            <p className="text-gray-500">Aquí tienes el resumen de hoy.</p>
          </div>
          <div className="bg-white p-2 rounded-full shadow">
            👤 <span className="font-bold text-sm text-gray-700 px-2">{user.rol}</span>
          </div>
        </header>

        {/* Tarjetas de Resumen (Dashboard Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta 1 */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase">Pacientes Registrados</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">1</p>
            <p className="text-sm text-green-500 mt-1">Juan Pérez</p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase">Citas Hoy</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
            <p className="text-sm text-gray-400 mt-1">Sin agenda</p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-bold uppercase">Ingresos del Mes</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">$0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;