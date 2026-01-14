import { Users, ClipboardList, UserCircle, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Doctor', rol: 'Odontologo' };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">¡Hola, {user.nombre}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen de la actividad clínica de hoy.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <div className="bg-blue-100 p-1.5 rounded-lg">
              <UserCircle className="text-blue-600 w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-bold uppercase">Rol</span>
            <span className="text-sm font-semibold text-gray-700 capitalize leading-none">{user.rol}</span>
          </div>
        </div>
      </header>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
              <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pacientes Totales</p>
                  <h3 className="text-3xl font-extrabold text-gray-800 mt-2">12</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Users size={24} />
              </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-xs font-medium bg-green-50 w-fit px-2 py-1 rounded">
              <span>+2 esta semana</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
              <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tratamientos</p>
                  <h3 className="text-3xl font-extrabold text-gray-800 mt-2">8</h3>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                  <ClipboardList size={24} />
              </div>
          </div>
           <div className="mt-4 text-gray-400 text-xs">
              <span>Pendientes de revisión</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
              <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ingresos (Mes)</p>
                  <h3 className="text-3xl font-extrabold text-gray-800 mt-2">$0.00</h3>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-green-600">
                  <DollarSign size={24} />
              </div>
          </div>
           <div className="mt-4 text-gray-400 text-xs">
              <span>Actualizado ahora mismo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;