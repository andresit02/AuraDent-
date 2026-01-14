import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUsuario } from '../services/authService';
import { LayoutDashboard, Users, ClipboardList, Activity, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUsuario();
    navigate('/');
  };

  // Estilo para el botón activo
  const activeClass = "bg-blue-50 text-blue-700 shadow-sm";
  const inactiveClass = "text-gray-600 hover:bg-gray-50 hover:text-blue-600";

  return (
    <aside className="w-64 bg-white shadow-xl flex flex-col z-20 h-screen fixed left-0 top-0 border-r border-gray-100">
      
      {/* LOGO */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
           <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">AuraDent</h2>
          <p className="text-xs text-gray-400 font-medium">Gestión Clínica</p>
        </div>
      </div>
      
      {/* NAVEGACIÓN */}
      <nav className="flex-1 mt-6 px-4 space-y-2">
        
        <button 
            onClick={() => navigate('/dashboard')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${location.pathname === '/dashboard' ? activeClass : inactiveClass}`}
        >
          <LayoutDashboard size={20} />
          <span>Inicio</span>
        </button>

        <button 
            onClick={() => navigate('/pacientes')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${location.pathname === '/pacientes' ? activeClass : inactiveClass}`}
        >
          <Users size={20} />
          <span>Pacientes</span>
        </button>

        <button 
            onClick={() => navigate('/fichas')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${location.pathname === '/fichas' ? activeClass : inactiveClass}`}
        >
          <ClipboardList size={20} />
          <span>Fichas Técnicas</span>
        </button>

        <button 
            onClick={() => navigate('/odontograma')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${location.pathname === '/odontograma' ? activeClass : inactiveClass}`}
        >
          <Activity size={20} />
          <span>Odontograma</span>
        </button>
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 py-2.5 rounded-lg transition-all font-medium text-sm"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;