import { useState, useEffect } from 'react';
import { Users, ClipboardList, UserCircle, DollarSign, RefreshCw } from 'lucide-react';
import { getPacientes } from '../services/patientService';
import { getFichas, getPagosByPresupuesto } from '../services/clinicalService';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Doctor', rol: 'Odontologo' };
  
  const [stats, setStats] = useState({
    totalPacientes: 0,
    tratamientosPendientes: 0,
    ingresosMes: 0,
    pacientesEstaSemana: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Función para cargar datos del dashboard
  const cargarDatosDashboard = async () => {
    try {
      setIsRefreshing(true);
      
      // Obtener datos en paralelo
      const [pacientes, fichas] = await Promise.all([
        getPacientes(),
        getFichas()
      ]);
      
      // Calcular estadísticas
      const totalPacientes = pacientes.length;
      
      // Contar tratamientos pendientes (fichas sin diagnóstico o tratamiento)
      const tratamientosPendientes = fichas.filter(ficha => 
        !ficha.diagnostico || !ficha.tratamiento
      ).length;
      
      // Calcular ingresos del mes actual
      const mesActual = new Date().getMonth();
      const añoActual = new Date().getFullYear();
      
      let ingresosMes = 0;
      
      // Intentar obtener ingresos de presupuestos y pagos
      try {
        // Para cada ficha con presupuesto, sumar pagos del mes
        for (const ficha of fichas) {
          try {
            // Aquí necesitarías una función que obtenga el presupuesto de la ficha
            // y luego los pagos de ese presupuesto
            // Por ahora, usaré un enfoque simplificado
            if (ficha.fecha_consulta) {
              const fechaFicha = new Date(ficha.fecha_consulta);
              if (fechaFicha.getMonth() === mesActual && fechaFicha.getFullYear() === añoActual) {
                // Si la ficha tiene monto, sumarlo (esto es temporal)
                if (ficha.monto_estimado) {
                  ingresosMes += parseFloat(ficha.monto_estimado) || 0;
                }
              }
            }
          } catch (error) {
            console.warn(`Error procesando ficha ${ficha.id}:`, error.message);
          }
        }
      } catch (error) {
        console.warn('No se pudieron calcular ingresos detallados:', error.message);
      }
      
      // Calcular pacientes nuevos esta semana
      const unaSemanaAtras = new Date();
      unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
      
      const pacientesEstaSemana = pacientes.filter(paciente => {
        if (paciente.created_at) {
          const fechaCreacion = new Date(paciente.created_at);
          return fechaCreacion >= unaSemanaAtras;
        }
        return false;
      }).length;
      
      // Actualizar estado
      setStats({
        totalPacientes,
        tratamientosPendientes,
        ingresosMes: Math.round(ingresosMes * 100) / 100, // Redondear a 2 decimales
        pacientesEstaSemana
      });
      
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      // Mantener datos anteriores si hay error
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatosDashboard();
    
    // Configurar actualización automática cada 60 segundos
    const intervalId = setInterval(cargarDatosDashboard, 60000);
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, []);

  // También recargar cuando la pestaña se vuelve visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        cargarDatosDashboard();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Formatear número como moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Formatear fecha de última actualización
  const formatLastUpdated = (date) => {
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">¡Hola, {user.nombre}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen de la actividad clínica de hoy.</p>
          
          {/* Indicador de última actualización */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400">
              Última actualización: {formatLastUpdated(lastUpdated)}
            </span>
            <button
              onClick={cargarDatosDashboard}
              disabled={isRefreshing}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:text-gray-400"
              title="Actualizar datos"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
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
        
        {/* Card 1: Pacientes Totales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pacientes Totales</p>
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
              ) : (
                <h3 className="text-3xl font-extrabold text-gray-800 mt-2">
                  {stats.totalPacientes}
                </h3>
              )}
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <Users size={24} />
            </div>
          </div>
          {!isLoading && (
            <div className="mt-4 flex items-center text-green-600 text-xs font-medium bg-green-50 w-fit px-2 py-1 rounded">
              <span>+{stats.pacientesEstaSemana} esta semana</span>
            </div>
          )}
        </div>

        {/* Card 2: Tratamientos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tratamientos</p>
              {isLoading ? (
                <div className="h-9 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
              ) : (
                <h3 className="text-3xl font-extrabold text-gray-800 mt-2">
                  {stats.tratamientosPendientes}
                </h3>
              )}
            </div>
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
              <ClipboardList size={24} />
            </div>
          </div>
          <div className="mt-4 text-gray-400 text-xs">
            <span>Pendientes de revisión</span>
          </div>
        </div>

        {/* Card 3: Ingresos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ingresos (Mes)</p>
              {isLoading ? (
                <div className="h-9 w-32 bg-gray-200 animate-pulse rounded mt-2"></div>
              ) : (
                <h3 className="text-3xl font-extrabold text-gray-800 mt-2">
                  {formatCurrency(stats.ingresosMes)}
                </h3>
              )}
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

      {/* Indicador de carga */}
      {isLoading && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <RefreshCw size={16} className="animate-spin" />
            Cargando datos del dashboard...
          </div>
        </div>
      )}

      {/* Si no hay datos después de cargar */}
      {!isLoading && stats.totalPacientes === 0 && (
        <div className="mt-8 text-center p-8 bg-gray-50 rounded-2xl">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay datos aún</h3>
          <p className="text-gray-500 mb-4">
            Comienza registrando pacientes y fichas clínicas para ver estadísticas aquí.
          </p>
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => window.location.href = '/pacientes'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Ir a Pacientes
            </button>
            <button 
              onClick={() => window.location.href = '/fichas'}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Ir a Fichas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;