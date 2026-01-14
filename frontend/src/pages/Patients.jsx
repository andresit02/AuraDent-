import { useState, useEffect } from 'react';
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from '../services/patientService'; // <--- Importamos las nuevas funciones
import { useNavigate } from 'react-router-dom';

const Patients = () => {
  const navigate = useNavigate();
  // --- PEGAR AQUÍ EL BLOQUE DE SEGURIDAD ---
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/');
    }
  }, [user, navigate]);
  // -----------------------------------------
  const [pacientes, setPacientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Para saber si estamos editando o creando

  const [formPaciente, setFormPaciente] = useState({
    id: null, // Guardamos el ID para saber a cuál actualizar
    num_historia_clinica: '',
    nombres: '',
    apellidos: '',
    cedula: '',
    edad: '',
    telefono: '',
    domicilio: ''
  });

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      const data = await getPacientes();
      setPacientes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setFormPaciente({
      ...formPaciente,
      [e.target.name]: e.target.value
    });
  };

  // --- FUNCIÓN PARA PREPARAR LA EDICIÓN ---
  const handleEditClick = (paciente) => {
    setFormPaciente(paciente); // Llenamos el formulario con los datos del paciente
    setIsEditing(true);        // Cambiamos modo a "Edición"
    setShowForm(true);         // Mostramos el formulario
  };

  // --- FUNCIÓN PARA ELIMINAR ---
  const handleDeleteClick = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar a este paciente?")) {
        try {
            await deletePaciente(id);
            alert("Paciente eliminado");
            cargarPacientes(); // Recargar tabla
        } catch (error) {
            alert("No se puede eliminar (quizás tiene fichas asociadas)");
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // MODO EDICIÓN
        await updatePaciente(formPaciente.id, formPaciente);
        alert("¡Paciente actualizado correctamente!");
      } else {
        // MODO CREACIÓN
        await createPaciente(formPaciente);
        alert("¡Paciente registrado correctamente!");
      }
      
      // Limpieza final
      setShowForm(false);
      setIsEditing(false);
      cargarPacientes();
      setFormPaciente({ id: null, num_historia_clinica: '', nombres: '', apellidos: '', cedula: '', edad: '', telefono: '', domicilio: '' });
    
    } catch (error) {
      alert("Error al guardar. Verifica los datos.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Pacientes 👥</h1>
          <p className="text-gray-500">Administra los datos personales</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-blue-600 font-semibold">
            ← Volver al Dashboard
        </button>
      </div>

      <button 
        onClick={() => {
            setShowForm(!showForm);
            setIsEditing(false); // Si abre nuevo, reseteamos modo edición
            setFormPaciente({ id: null, num_historia_clinica: '', nombres: '', apellidos: '', cedula: '', edad: '', telefono: '', domicilio: '' });
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition mb-6"
      >
        {showForm ? 'Cancelar' : '+ Nuevo Paciente'}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-4 text-blue-600">
            {isEditing ? 'Editar Paciente' : 'Registrar Paciente'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="num_historia_clinica" placeholder="N° Historia Clínica" onChange={handleInputChange} value={formPaciente.num_historia_clinica} className="border p-2 rounded" required />
            <input name="cedula" placeholder="Cédula" onChange={handleInputChange} value={formPaciente.cedula} className="border p-2 rounded" required />
            <input name="nombres" placeholder="Nombres" onChange={handleInputChange} value={formPaciente.nombres} className="border p-2 rounded" required />
            <input name="apellidos" placeholder="Apellidos" onChange={handleInputChange} value={formPaciente.apellidos} className="border p-2 rounded" required />
            <input name="edad" type="number" placeholder="Edad" onChange={handleInputChange} value={formPaciente.edad} className="border p-2 rounded" />
            <input name="telefono" placeholder="Teléfono" onChange={handleInputChange} value={formPaciente.telefono} className="border p-2 rounded" />
            <input name="domicilio" placeholder="Domicilio" onChange={handleInputChange} value={formPaciente.domicilio} className="border p-2 rounded w-full md:col-span-2" />
            
            <button type="submit" className={`text-white px-4 py-2 rounded md:col-span-2 ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
              {isEditing ? 'Actualizar Datos' : 'Guardar Paciente'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">H.C.</th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Paciente</th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Cédula</th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Teléfono</th>
              <th className="px-5 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-5 border-b bg-white text-sm font-bold text-blue-600">{p.num_historia_clinica}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">{p.nombres} {p.apellidos}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">{p.cedula}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">{p.telefono}</td>
                <td className="px-5 py-5 border-b bg-white text-sm text-center">
                   {/* BOTÓN EDITAR */}
                   <button 
                        onClick={() => handleEditClick(p)}
                        className="text-orange-500 hover:text-orange-700 font-bold mr-4"
                   >
                        ✏️ Editar
                   </button>
                   
                   {/* BOTÓN ELIMINAR */}
                   <button 
                        onClick={() => handleDeleteClick(p.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                   >
                        🗑️ Eliminar
                   </button>
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