import { useState, useEffect } from 'react';
import { 
  getFichas, 
  createFicha,
  getPresupuestoByFicha,
  createPresupuesto,
  getPagosByPresupuesto,
  createPago 
} from '../services/clinicalService';
import { getPacientes } from '../services/patientService';
import { useNavigate } from 'react-router-dom';

const ClinicalRecords = () => {
  const navigate = useNavigate();
  
  // Seguridad
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Estados
  const [fichas, setFichas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState(null);
  const [presupuesto, setPresupuesto] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [showPresupuestoForm, setShowPresupuestoForm] = useState(false);
  const [showPagoForm, setShowPagoForm] = useState(false);
  
  // Formularios
  const [nuevaFicha, setNuevaFicha] = useState({
    paciente_id: '',
    odontologo_id: user?.id || 1,
    motivo_consulta: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    pieza_dental: ''
  });
  
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState({
    ficha_id: '',
    total: '',
    descripcion: '',
    estado: 'pendiente'
  });
  
  const [nuevoPago, setNuevoPago] = useState({
    presupuesto_id: '',
    monto: '',
    metodo_pago: 'efectivo',
    observaciones: ''
  });

  // Cargar datos
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [fichasData, pacientesData] = await Promise.all([
        getFichas(),
        getPacientes()
      ]);
      setFichas(fichasData);
      setPacientes(pacientesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  // Función para formatear fecha
  const formatFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no disponible';
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return fechaString;
    }
  };

  // Cargar presupuesto y pagos cuando se selecciona una ficha
  useEffect(() => {
    if (selectedFicha) {
      cargarPresupuestoYPagos(selectedFicha.id);
    }
  }, [selectedFicha]);

  const cargarPresupuestoYPagos = async (fichaId) => {
    try {
      // Cargar presupuesto
      const presupuestoData = await getPresupuestoByFicha(fichaId);
      setPresupuesto(presupuestoData);
      
      // Si hay presupuesto, cargar sus pagos
      if (presupuestoData && presupuestoData.id) {
        const pagosData = await getPagosByPresupuesto(presupuestoData.id);
        setPagos(pagosData);
      } else {
        setPagos([]);
      }
    } catch (error) {
      console.error('Error cargando presupuesto/pagos:', error);
      setPresupuesto(null);
      setPagos([]);
    }
  };

  // Handlers para fichas
  const handleInputChange = (e) => {
    setNuevaFicha({
      ...nuevaFicha,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitFicha = async (e) => {
    e.preventDefault();
    try {
      if (!nuevaFicha.paciente_id) {
        alert("Por favor selecciona un paciente");
        return;
      }
      await createFicha(nuevaFicha);
      alert("¡Ficha creada exitosamente!");
      setShowForm(false);
      cargarDatos();
      setNuevaFicha({ 
        paciente_id: '', 
        odontologo_id: user?.id || 1, 
        motivo_consulta: '', 
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
        pieza_dental: '' 
      });
    } catch (error) {
      alert("Error al guardar la ficha: " + error.message);
    }
  };

  // Handlers para presupuestos
  const handlePresupuestoChange = (e) => {
    setNuevoPresupuesto({
      ...nuevoPresupuesto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitPresupuesto = async (e) => {
    e.preventDefault();
    try {
      if (!nuevoPresupuesto.total) {
        alert("Por favor ingresa el total del presupuesto");
        return;
      }
      
      const presupuestoData = {
        ...nuevoPresupuesto,
        ficha_id: selectedFicha.id
      };
      
      await createPresupuesto(presupuestoData);
      alert("¡Presupuesto creado exitosamente!");
      setShowPresupuestoForm(false);
      cargarPresupuestoYPagos(selectedFicha.id);
      setNuevoPresupuesto({
        ficha_id: '',
        total: '',
        descripcion: '',
        estado: 'pendiente'
      });
    } catch (error) {
      alert("Error al crear presupuesto: " + error.message);
    }
  };

  // Handlers para pagos
  const handlePagoChange = (e) => {
    setNuevoPago({
      ...nuevoPago,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitPago = async (e) => {
    e.preventDefault();
    try {
      if (!nuevoPago.monto) {
        alert("Por favor ingresa el monto del pago");
        return;
      }
      
      const pagoData = {
        ...nuevoPago,
        presupuesto_id: presupuesto.id
      };
      
      await createPago(pagoData);
      alert("¡Pago registrado exitosamente!");
      setShowPagoForm(false);
      cargarPresupuestoYPagos(selectedFicha.id);
      setNuevoPago({
        presupuesto_id: '',
        monto: '',
        metodo_pago: 'efectivo',
        observaciones: ''
      });
    } catch (error) {
      alert("Error al registrar pago: " + error.message);
    }
  };

  // Calcular total pagado
  const calcularTotalPagado = () => {
    return pagos.reduce((total, pago) => total + parseFloat(pago.monto), 0);
  };

  const totalPagado = calcularTotalPagado();
  const saldoPendiente = presupuesto ? (parseFloat(presupuesto.total) - totalPagado) : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fichas Técnicas 📋</h1>
          <p className="text-gray-500">Registro de tratamientos, presupuestos y pagos</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-blue-600 font-semibold"
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Botón nueva ficha */}
      <button 
        onClick={() => setShowForm(!showForm)}
        className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition mb-6"
      >
        {showForm ? 'Cancelar' : '+ Nueva Ficha'}
      </button>

      {/* Formulario de nueva ficha */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-4 text-purple-600">Nueva Consulta</h3>
          <form onSubmit={handleSubmitFicha} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Paciente</label>
              <select 
                name="paciente_id" 
                onChange={handleInputChange} 
                value={nuevaFicha.paciente_id}
                className="w-full border p-2 rounded bg-white"
                required
              >
                <option value="">-- Selecciona un Paciente --</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombres} {p.apellidos} {p.cedula ? `(${p.cedula})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <input 
                name="motivo_consulta" 
                placeholder="Motivo de consulta (Ej: Dolor intenso)" 
                onChange={handleInputChange} 
                value={nuevaFicha.motivo_consulta} 
                className="w-full border p-2 rounded" 
                required 
              />
            </div>

            <div>
              <input 
                name="diagnostico" 
                placeholder="Diagnóstico" 
                onChange={handleInputChange} 
                value={nuevaFicha.diagnostico} 
                className="w-full border p-2 rounded" 
              />
            </div>

            <div>
              <input 
                name="tratamiento" 
                placeholder="Tratamiento indicado" 
                onChange={handleInputChange} 
                value={nuevaFicha.tratamiento} 
                className="w-full border p-2 rounded" 
              />
            </div>

            <div>
              <input 
                name="pieza_dental" 
                type="number"
                placeholder="Pieza dental (Ej: 18)" 
                onChange={handleInputChange} 
                value={nuevaFicha.pieza_dental} 
                className="w-full border p-2 rounded" 
              />
            </div>

            <div>
              <textarea 
                name="observaciones" 
                placeholder="Observaciones" 
                onChange={handleInputChange} 
                value={nuevaFicha.observaciones} 
                className="w-full border p-2 rounded" 
                rows="3"
              />
            </div>

            <div className="md:col-span-2">
              <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full">
                Guardar Ficha
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de fichas */}
      <div className="bg-white rounded shadow overflow-hidden mb-8">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Fecha y Hora</th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Paciente</th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Motivo</th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fichas.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No hay fichas registradas
                </td>
              </tr>
            ) : (
              fichas.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    {formatFecha(f.fecha_consulta)}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm font-bold text-purple-600">
                    {f.nombres} {f.apellidos}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <div className="truncate max-w-xs">{f.motivo_consulta}</div>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <button 
                      onClick={() => setSelectedFicha(f)}
                      className="text-blue-600 hover:text-blue-900 font-medium mr-3"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {selectedFicha && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Encabezado */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Detalles de la Ficha #{selectedFicha.id}
              </h2>
              <button 
                onClick={() => {
                  setSelectedFicha(null);
                  setPresupuesto(null);
                  setPagos([]);
                  setShowPresupuestoForm(false);
                  setShowPagoForm(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-purple-600 mb-3">Información del Paciente</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Nombre:</span> <span className="font-medium">{selectedFicha.nombres} {selectedFicha.apellidos}</span></p>
                    {selectedFicha.rut && <p><span className="text-gray-500">RUT:</span> <span className="font-medium">{selectedFicha.rut}</span></p>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-purple-600 mb-3">Detalles de la Consulta</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Fecha:</span> <span className="font-medium">{formatFecha(selectedFicha.fecha_consulta)}</span></p>
                    <p><span className="text-gray-500">Pieza dental:</span> <span className="font-medium">{selectedFicha.pieza_dental || 'No especificada'}</span></p>
                  </div>
                </div>
              </div>

              {/* Motivo, diagnóstico y tratamiento */}
              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Motivo de consulta</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-gray-800">{selectedFicha.motivo_consulta}</p>
                  </div>
                </div>

                {selectedFicha.diagnostico && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Diagnóstico</h4>
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-gray-800">{selectedFicha.diagnostico}</p>
                    </div>
                  </div>
                )}

                {selectedFicha.tratamiento && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Tratamiento indicado</h4>
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-gray-800">{selectedFicha.tratamiento}</p>
                    </div>
                  </div>
                )}

                {selectedFicha.observaciones && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Observaciones</h4>
                    <div className="bg-yellow-50 p-4 rounded">
                      <p className="text-gray-800">{selectedFicha.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN DE PRESUPUESTO Y PAGOS */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Presupuesto y Pagos</h3>
                  {!presupuesto && (
                    <button 
                      onClick={() => setShowPresupuestoForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      + Crear Presupuesto
                    </button>
                  )}
                </div>

                {/* Formulario de presupuesto */}
                {showPresupuestoForm && (
                  <div className="bg-gray-50 p-4 rounded mb-6">
                    <h4 className="font-semibold mb-3">Nuevo Presupuesto</h4>
                    <form onSubmit={handleSubmitPresupuesto} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input 
                          type="number" 
                          step="0.01"
                          name="total" 
                          placeholder="Total ($)" 
                          value={nuevoPresupuesto.total}
                          onChange={handlePresupuestoChange}
                          className="w-full border p-2 rounded"
                          required
                        />
                      </div>
                      <div>
                        <select 
                          name="estado" 
                          value={nuevoPresupuesto.estado}
                          onChange={handlePresupuestoChange}
                          className="w-full border p-2 rounded"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="aprobado">Aprobado</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <textarea 
                          name="descripcion" 
                          placeholder="Descripción del presupuesto" 
                          value={nuevoPresupuesto.descripcion}
                          onChange={handlePresupuestoChange}
                          className="w-full border p-2 rounded"
                          rows="2"
                        />
                      </div>
                      <div>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                          Guardar Presupuesto
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowPresupuestoForm(false)}
                          className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Información del presupuesto */}
                {presupuesto && (
                  <div className="mb-6">
                    <div className="bg-white border rounded p-4 shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg">Presupuesto #{presupuesto.id}</h4>
                          <p className="text-gray-600">Estado: 
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${
                              presupuesto.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                              presupuesto.estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {presupuesto.estado.toUpperCase()}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            ${parseFloat(presupuesto.total).toLocaleString('es-CL')}
                          </p>
                          <p className="text-sm text-gray-500">Total presupuestado</p>
                        </div>
                      </div>
                      
                      {presupuesto.descripcion && (
                        <p className="text-gray-700 mb-4">{presupuesto.descripcion}</p>
                      )}
                      
                      {/* Resumen de pagos */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold">Resumen de Pagos</h5>
                          <button 
                            onClick={() => setShowPagoForm(true)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            + Registrar Pago
                          </button>
                        </div>
                        
                        {/* Formulario de pago */}
                        {showPagoForm && (
                          <div className="bg-gray-50 p-3 rounded mb-4">
                            <form onSubmit={handleSubmitPago} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <input 
                                type="number" 
                                step="0.01"
                                name="monto" 
                                placeholder="Monto ($)" 
                                value={nuevoPago.monto}
                                onChange={handlePagoChange}
                                className="border p-2 rounded"
                                required
                              />
                              <select 
                                name="metodo_pago" 
                                value={nuevoPago.metodo_pago}
                                onChange={handlePagoChange}
                                className="border p-2 rounded"
                              >
                                <option value="efectivo">Efectivo</option>
                                <option value="tarjeta">Tarjeta</option>
                                <option value="transferencia">Transferencia</option>
                              </select>
                              <div className="flex">
                                <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex-1">
                                  Registrar
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => setShowPagoForm(false)}
                                  className="ml-2 bg-gray-300 text-gray-800 px-3 py-2 rounded hover:bg-gray-400"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                        
                        {/* Tabla de pagos */}
                        {pagos.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="py-2 px-3 text-left">Fecha</th>
                                  <th className="py-2 px-3 text-left">Monto</th>
                                  <th className="py-2 px-3 text-left">Método</th>
                                  <th className="py-2 px-3 text-left">Observaciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pagos.map((pago) => (
                                  <tr key={pago.id} className="border-b">
                                    <td className="py-2 px-3">{formatFecha(pago.fecha_pago)}</td>
                                    <td className="py-2 px-3 font-medium">${parseFloat(pago.monto).toLocaleString('es-CL')}</td>
                                    <td className="py-2 px-3">
                                      <span className="capitalize">{pago.metodo_pago}</span>
                                    </td>
                                    <td className="py-2 px-3 text-gray-600">{pago.observaciones || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-3">No hay pagos registrados</p>
                        )}
                        
                        {/* Totales */}
                        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-500">Total Presupuestado</p>
                            <p className="text-lg font-bold">${parseFloat(presupuesto.total).toLocaleString('es-CL')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Pagado</p>
                            <p className="text-lg font-bold text-green-600">${totalPagado.toLocaleString('es-CL')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Saldo Pendiente</p>
                            <p className={`text-lg font-bold ${
                              saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              ${saldoPendiente.toLocaleString('es-CL')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pie del modal */}
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => {
                  setSelectedFicha(null);
                  setPresupuesto(null);
                  setPagos([]);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalRecords;