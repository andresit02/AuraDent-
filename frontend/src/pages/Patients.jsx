import { useState, useEffect } from 'react';
import { getPacientes, createPaciente } from '../services/patientService';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [showForm, setShowForm] = useState(false); // Para mostrar/ocultar el formulario

  // Estado para el formulario nuevo
  const [nuevoPaciente, setNuevoPaciente] = useState({
    num_historia_clinica: '',
    nombres: '',
    apellidos: '',
    cedula: '',
    edad: '',
    telefono: '',
    domicilio: ''
  });

  // Cargar pacientes al iniciar
  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      const data = await getPacientes();
      setPacientes(data);
    } catch (error) {
      alert("Error cargando pacientes");
    }
  };

  const handleInputChange = (e) => {
    setNuevoPaciente({
      ...nuevoPaciente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPaciente(nuevoPaciente);
      alert("¡Paciente registrado correctamente!");
      setShowForm(false); // Ocultar formulario
      cargarPacientes(); // Recargar la lista
      // Limpiar formulario
      setNuevoPaciente({ num_historia_clinica: '', nombres: '', apellidos: '', cedula: '', edad: '', telefono: '', domicilio: '' });
    } catch (error) {
      alert("Error al guardar. Verifica que la Historia Clínica o Cédula no estén repetidas.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Pacientes 👥</h1>
          <p className="text-gray-500">Administra los datos personales</p>
        </div>
        <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-blue-600 font-semibold"
        >
            ← Volver al Dashboard
        </button>
      </div>

      {/* Botón para agregar nuevo */}
      <button 
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition mb-6"
      >
        {showForm ? 'Cancelar' : '+ Nuevo Paciente'}
      </button>

      {/* FORMULARIO (Solo visible si showForm es true) */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow-lg mb-8 animate-fade-in-down">
          <h3 className="text-xl font-bold mb-4 text-blue-600">Registrar Paciente</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="num_historia_clinica" placeholder="N° Historia Clínica" onChange={handleInputChange} value={nuevoPaciente.num_historia_clinica} className="border p-2 rounded" required />
            <input name="cedula" placeholder="Cédula" onChange={handleInputChange} value={nuevoPaciente.cedula} className="border p-2 rounded" required />
            <input name="nombres" placeholder="Nombres" onChange={handleInputChange} value={nuevoPaciente.nombres} className="border p-2 rounded" required />
            <input name="apellidos" placeholder="Apellidos" onChange={handleInputChange} value={nuevoPaciente.apellidos} className="border p-2 rounded" required />
            <input name="edad" type="number" placeholder="Edad" onChange={handleInputChange} value={nuevoPaciente.edad} className="border p-2 rounded" />
            <input name="telefono" placeholder="Teléfono" onChange={handleInputChange} value={nuevoPaciente.telefono} className="border p-2 rounded" />
            <input name="domicilio" placeholder="Domicilio" onChange={handleInputChange} value={nuevoPaciente.domicilio} className="border p-2 rounded w-full md:col-span-2" />
            
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">
              Guardar Paciente
            </button>
          </form>
        </div>
      )}

      {/* TABLA DE PACIENTES */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">H.C.</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paciente</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cédula</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teléfono</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-blue-600">
                  {p.num_historia_clinica}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {p.nombres} {p.apellidos}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {p.cedula}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {p.telefono}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                   <button className="text-blue-600 hover:text-blue-900 mr-2">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;