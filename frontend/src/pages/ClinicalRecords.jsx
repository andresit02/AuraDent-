import { useState, useEffect } from 'react';
import { getFichas, createFicha } from '../services/clinicalService';
import { getPacientes } from '../services/patientService'; // Reutilizamos para el dropdown
import { useNavigate } from 'react-router-dom';

const ClinicalRecords = () => {
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [pacientes, setPacientes] = useState([]); // Para llenar el <select>
  const [showForm, setShowForm] = useState(false);

  // Estado para la nueva ficha
  const [nuevaFicha, setNuevaFicha] = useState({
    paciente_id: '',
    odontologo_id: 1, // Por defecto el ID 1 (luego lo tomaremos del login)
    motivo_consulta: '',
    pieza_dental: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargamos fichas y pacientes en paralelo
      const [fichasData, pacientesData] = await Promise.all([
        getFichas(),
        getPacientes()
      ]);
      setFichas(fichasData);
      setPacientes(pacientesData);
    } catch (error) {
      console.error(error);
      // No mostramos alerta aquí para no ser molestos si un servicio está apagado
    }
  };

  const handleInputChange = (e) => {
    setNuevaFicha({
      ...nuevaFicha,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!nuevaFicha.paciente_id) {
        alert("Por favor selecciona un paciente");
        return;
      }
      await createFicha(nuevaFicha);
      alert("¡Ficha creada exitosamente!");
      setShowForm(false);
      cargarDatos(); // Recargar tabla
      setNuevaFicha({ paciente_id: '', odontologo_id: 1, motivo_consulta: '', pieza_dental: '' });
    } catch (error) {
      alert("Error al guardar la ficha. Asegúrate que el servicio de Fichas (3003) esté corriendo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fichas Técnicas 📋</h1>
          <p className="text-gray-500">Registro de tratamientos y diagnósticos</p>
        </div>
        <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-blue-600 font-semibold"
        >
            ← Volver al Dashboard
        </button>
      </div>

      <button 
        onClick={() => setShowForm(!showForm)}
        className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition mb-6"
      >
        {showForm ? 'Cancelar' : '+ Nueva Ficha'}
      </button>

      {/* FORMULARIO */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow-lg mb-8 animate-fade-in-down">
          <h3 className="text-xl font-bold mb-4 text-purple-600">Nueva Consulta</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            
            {/* Dropdown de Pacientes */}
            <div>
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
                    {p.nombres} {p.apellidos} ({p.cedula})
                  </option>
                ))}
              </select>
            </div>

            <input 
                name="motivo_consulta" 
                placeholder="Motivo de consulta (Ej: Dolor intenso)" 
                onChange={handleInputChange} 
                value={nuevaFicha.motivo_consulta} 
                className="border p-2 rounded" 
                required 
            />
            
            <input 
                name="pieza_dental" 
                type="number"
                placeholder="N° Pieza Dental (Ej: 18)" 
                onChange={handleInputChange} 
                value={nuevaFicha.pieza_dental} 
                className="border p-2 rounded" 
            />
            
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Guardar Ficha
            </button>
          </form>
        </div>
      )}

      {/* TABLA DE FICHAS */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Paciente</th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Motivo</th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fichas.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-gray-500">No hay fichas registradas</td></tr>
            ) : (
                fichas.map((f) => (
                <tr key={f.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(f.fecha_consulta).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-purple-600">
                    {f.nombres} {f.apellidos}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {f.motivo_consulta}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button className="text-blue-600 hover:text-blue-900">Ver Detalles</button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClinicalRecords;