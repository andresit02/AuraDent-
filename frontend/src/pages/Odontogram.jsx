import React, { useState, useEffect } from 'react';
import { Search, Save, X } from 'lucide-react';
import { getPacientes } from '../services/patientService';
import { getOdontograma, saveOdontograma } from '../services/odontogramService';
import { useNavigate } from 'react-router-dom';

// --- CONFIGURACIÓN ---
const DIENTES_PERMANENTES = {
  superior: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  inferior: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
};

const DIENTES_TEMPORALES = {
  superior: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  inferior: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]
};

const PROCEDIMIENTOS = [
  { value: 'sano', label: 'Sano', color: '#fff' },
  { value: 'caries', label: 'Caries', color: '#ef4444' },
  { value: 'profilactico', label: 'Profiláctico', color: '#3b82f6' },
  { value: 'restauracion_resina', label: 'Restauración Resina', color: '#8b5cf6' },
  { value: 'sellador', label: 'Sellador', color: '#f59e0b' },
  { value: 'extraccion', label: 'Extracción', color: '#000' },
  { value: 'corona', label: 'Corona', color: '#eab308' },
  { value: 'endodoncia', label: 'Endodoncia', color: '#ec4899' },
  { value: 'ausente', label: 'Ausente', color: '#6b7280' },
  { value: 'otros', label: 'Otros', color: '#14b8a6' }
];

// --- COMPONENTE DIENTE INTERACTIVO (SVG) ---
const DienteInteractivo = ({ numero, datos, onClick, isSelected }) => {
  const [hoveredSurface, setHoveredSurface] = useState(null);
  const superficies = datos?.superficies || {};
  
  const getColorSuperficie = (superficie) => {
    if (!superficies[superficie]) return '#fff';
    const proc = PROCEDIMIENTOS.find(p => p.value === superficies[superficie]);
    return proc?.color || '#fff';
  };

  const handleSurfaceClick = (e, superficie) => {
    e.stopPropagation();
    onClick(numero, superficie);
  };

  return (
    <div className="flex flex-col items-center gap-1 relative mx-1">
      <div className="text-[11px] font-bold text-gray-700">{numero}</div>
      <svg
        width="42" height="42" viewBox="0 0 48 48"
        className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
        style={{ filter: isSelected ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' : 'none' }}
      >
        <circle cx="24" cy="24" r="22" fill="none" stroke="#1f2937" strokeWidth="1.5" />
        <line x1="24" y1="2" x2="24" y2="46" stroke="#1f2937" strokeWidth="1" />
        <line x1="2" y1="24" x2="46" y2="24" stroke="#1f2937" strokeWidth="1" />
        
        {/* Superficies */}
        <path d="M 24 2 L 44 12 L 24 24 L 4 12 Z" fill={getColorSuperficie('oclusal')} stroke="#1f2937" strokeWidth="1" onClick={(e) => handleSurfaceClick(e, 'oclusal')} className="hover:opacity-80" />
        <path d="M 44 12 L 46 24 L 44 36 L 24 24 Z" fill={getColorSuperficie('distal')} stroke="#1f2937" strokeWidth="1" onClick={(e) => handleSurfaceClick(e, 'distal')} className="hover:opacity-80" />
        <path d="M 24 24 L 4 36 L 24 46 L 44 36 Z" fill={getColorSuperficie('vestibular')} stroke="#1f2937" strokeWidth="1" onClick={(e) => handleSurfaceClick(e, 'vestibular')} className="hover:opacity-80" />
        <path d="M 4 12 L 2 24 L 4 36 L 24 24 Z" fill={getColorSuperficie('mesial')} stroke="#1f2937" strokeWidth="1" onClick={(e) => handleSurfaceClick(e, 'mesial')} className="hover:opacity-80" />
        
        <circle cx="24" cy="24" r="6" fill={datos?.ausente ? '#dc2626' : 'none'} stroke="#1f2937" strokeWidth="1" />
        
        {(datos?.ausente || datos?.procedimiento === 'extraccion') && (
          <>
            <line x1="10" y1="10" x2="38" y2="38" stroke="#000" strokeWidth="3" />
            <line x1="38" y1="10" x2="10" y2="38" stroke="#000" strokeWidth="3" />
          </>
        )}
      </svg>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Odontogram = () => {
  const navigate = useNavigate();
  // --- PEGAR AQUÍ EL BLOQUE DE SEGURIDAD ---
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/');
    }
  }, [user, navigate]);
  // -----------------------------------------
  // Estados de datos
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [tipoOdontograma, setTipoOdontograma] = useState('adulto');
  const [odontograma, setOdontograma] = useState({}); // Aquí se guardan todos los dientes

  // Estados del editor
  const [dienteSeleccionado, setDienteSeleccionado] = useState(null);
  const [superficieSeleccionada, setSuperficieSeleccionada] = useState(null);
  const [piezaNumero, setPiezaNumero] = useState('');
  const [cara, setCara] = useState('');
  const [procedimiento, setProcedimiento] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [mostrarAusente, setMostrarAusente] = useState(false);

  const dientes = tipoOdontograma === 'adulto' ? DIENTES_PERMANENTES : DIENTES_TEMPORALES;

  // 1. Cargar Pacientes al iniciar
  useEffect(() => {
    async function load() {
      try {
        const data = await getPacientes();
        setPacientes(data);
      } catch (err) { alert("Error cargando pacientes (Servicio 3002)"); }
    }
    load();
  }, []);

  // 2. Cambiar Paciente y Cargar su Odontograma
  const handlePacienteChange = async (e) => {
    const id = e.target.value;
    setSelectedPaciente(id);
    setOdontograma({}); // Limpiar anterior

    if (id) {
      try {
        const data = await getOdontograma(id);
        if (data && data.datos_dientes) {
            setOdontograma(data.datos_dientes);
        }
      } catch (err) { console.log("Paciente nuevo o sin registro previo"); }
    }
  };

  // 3. Selección de Diente
  const handleDienteClick = (numero, superficie = null) => {
    if (!selectedPaciente) return alert("¡Primero selecciona un paciente arriba!");
    
    setDienteSeleccionado(numero);
    setSuperficieSeleccionada(superficie);
    setPiezaNumero(numero.toString());
    
    // Mapear nombre de cara
    const caraMap = { 'oclusal': 'Oclusal', 'mesial': 'Mesial', 'distal': 'Distal', 'vestibular': 'Vestibular' };
    setCara(superficie ? caraMap[superficie] : '');

    // Cargar datos existentes del diente si los hay
    const dienteData = odontograma[numero];
    if (dienteData) {
      setProcedimiento(dienteData.procedimiento || '');
      setDiagnostico(dienteData.diagnostico || '');
      setMostrarAusente(dienteData.ausente || false);
    } else {
      setProcedimiento('');
      setDiagnostico('');
      setMostrarAusente(false);
    }
  };

  // 4. Aplicar Cambios al Diente (Localmente)
  const handleAplicarCambios = () => {
    if (!dienteSeleccionado) return;

    const nuevoOdontograma = { ...odontograma };
    
    if (!nuevoOdontograma[dienteSeleccionado]) {
      nuevoOdontograma[dienteSeleccionado] = { surfaces: {}, procedimiento: '', diagnostico: '', ausente: false };
    }

    // Si seleccionó superficie, guardamos en surfaces
    if (superficieSeleccionada && procedimiento) {
        if (!nuevoOdontograma[dienteSeleccionado].superficies) nuevoOdontograma[dienteSeleccionado].superficies = {};
        nuevoOdontograma[dienteSeleccionado].superficies[superficieSeleccionada] = procedimiento;
    }

    // Guardar datos generales
    nuevoOdontograma[dienteSeleccionado].procedimiento = procedimiento;
    nuevoOdontograma[dienteSeleccionado].diagnostico = diagnostico;
    nuevoOdontograma[dienteSeleccionado].ausente = mostrarAusente;

    setOdontograma(nuevoOdontograma);
    
    // Limpiar form
    handleCancelar();
  };

  // 5. Guardar DEFINITIVAMENTE en Backend
  const handleGuardarEnBaseDatos = async () => {
    if (!selectedPaciente) return;
    try {
        await saveOdontograma(selectedPaciente, odontograma);
        alert("✅ Odontograma guardado correctamente en la Base de Datos");
    } catch (error) {
        alert("❌ Error guardando en servidor");
    }
  };

  const handleCancelar = () => {
    setDienteSeleccionado(null);
    setSuperficieSeleccionada(null);
    setPiezaNumero('');
    setCara('');
    setProcedimiento('');
    setDiagnostico('');
    setMostrarAusente(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER Y SELECTOR DE PACIENTE */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-blue-600">← Volver</button>
                <h1 className="text-2xl font-bold text-gray-800">Odontograma 🦷</h1>
                
                {/* SELECTOR IMPORTANTE */}
                <select 
                    className="border-2 border-blue-200 rounded-md p-2 bg-blue-50 font-semibold text-blue-800"
                    onChange={handlePacienteChange}
                    value={selectedPaciente}
                >
                    <option value="">-- Seleccionar Paciente --</option>
                    {pacientes.map(p => (
                        <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
                    ))}
                </select>
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={() => setTipoOdontograma(tipoOdontograma === 'adulto' ? 'infantil' : 'adulto')}
                    className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200"
                >
                    Cambiar a {tipoOdontograma === 'adulto' ? 'Infantil' : 'Adulto'}
                </button>
                <button 
                    onClick={handleGuardarEnBaseDatos}
                    disabled={!selectedPaciente}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold shadow flex items-center gap-2 disabled:bg-gray-400"
                >
                    <Save size={18} /> Guardar Todo
                </button>
            </div>
        </div>

        {/* ODONTOGRAMA VISUAL */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 overflow-x-auto">
          {/* Superior */}
          <div className="flex justify-center gap-1 mb-8 border-b-2 border-dashed border-gray-200 pb-8">
            {dientes.superior.map((num) => (
               <DienteInteractivo key={num} numero={num} datos={odontograma[num]} onClick={handleDienteClick} isSelected={dienteSeleccionado === num} />
            ))}
          </div>
          {/* Inferior */}
          <div className="flex justify-center gap-1">
            {dientes.inferior.map((num) => (
               <DienteInteractivo key={num} numero={num} datos={odontograma[num]} onClick={handleDienteClick} isSelected={dienteSeleccionado === num} />
            ))}
          </div>
        </div>

        {/* PANEL DE EDICIÓN (Solo visible si hay diente seleccionado) */}
        <div className={`bg-white rounded-lg shadow-lg p-6 border-2 border-blue-100 transition-all ${!dienteSeleccionado ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-lg font-bold text-blue-800 mb-4 border-b pb-2">
            Editar Pieza {piezaNumero} {cara ? `- Cara ${cara}` : ''}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Procedimiento / Estado</label>
                <select
                  value={procedimiento}
                  onChange={(e) => setProcedimiento(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Seleccionar --</option>
                  {PROCEDIMIENTOS.map(proc => (
                    <option key={proc.value} value={proc.value}>{proc.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-red-50 p-2 rounded border border-red-100">
                <input
                  type="checkbox" id="ausente" checked={mostrarAusente}
                  onChange={(e) => setMostrarAusente(e.target.checked)}
                  className="w-5 h-5 text-red-600"
                />
                <label htmlFor="ausente" className="font-medium text-red-700">Marcar como Ausente / Extracción</label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnóstico (Texto)</label>
                <div className="relative">
                  <input
                    type="text" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)}
                    placeholder="Ej: Caries profunda..."
                    className="w-full px-4 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={handleCancelar} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2">
                  <X size={16} /> Cancelar
                </button>
                <button onClick={handleAplicarCambios} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 font-bold">
                  <Save size={16} /> Aplicar a Pieza
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
           <strong>💡 Ayuda:</strong> 1. Selecciona un paciente. 2. Haz clic en un diente (o en una parte específica del diente). 3. Elige el procedimiento abajo y dale a "Aplicar a Pieza". 4. Al finalizar, pulsa el botón verde "Guardar Todo" arriba.
        </div>
      </div>
    </div>
  );
}

export default Odontogram;