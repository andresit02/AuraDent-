import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos el hook para navegar
import { loginUsuario } from '../services/authService'; // Importamos nuestro servicio de conexión

const Login = () => {
  const navigate = useNavigate(); // Inicializamos la navegación

  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '' // Debe coincidir con lo que espera el Backend
  });
  
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Llamamos al Backend
      const data = await loginUsuario(formData);
      
      // 2. Si es exitoso, mostramos en consola y redirigimos
      console.log('Login exitoso:', data);
      
      // 3. Redireccionar al Dashboard automáticamente
      navigate('/dashboard'); 
      
    } catch (err) {
      // 4. Si falla, mostramos el error
      console.error(err);
      setError(err.error || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Fondo Gradient Médico: Suave, limpio y profesional
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 flex items-center justify-center p-4">
      
      {/* 2. Cuadro Flotante: Shadow-2xl para elevación y rounded-2xl para modernidad */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/50 relative overflow-hidden">
        
        {/* Decoración sutil superior (opcional, para dar toque 'brand') */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-teal-400"></div>

        <div className="text-center mb-8 mt-2">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            AuraDent <span className="text-blue-500">🦷</span>
          </h1>
          {/* 3. Mensaje Institucional */}
          <p className="text-blue-600 font-medium text-sm mt-2 uppercase tracking-wide">
            Gestión clínica odontológica segura y moderna
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-6 text-sm flex items-center shadow-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-600 text-sm font-semibold mb-2 ml-1">
              Usuario
            </label>
            {/* 4. Microadaptación: focus:ring suave en azul clínico */}
            <input
              type="text"
              name="usuario"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200"
              placeholder="Ej: dra_magda"
              value={formData.usuario}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 text-sm font-semibold mb-2 ml-1">
              Contraseña
            </label>
            <input
              type="password"
              name="contrasena"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200"
              placeholder="••••••••"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            // 4. Botón con feedback táctil (active:scale-[0.98]) pero sin locuras
            className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 transform 
              ${loading 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:to-blue-600 active:scale-[0.98]'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </span>
            ) : 'Ingresar al Sistema'}
          </button>
        </form>
        
        {/* 5. Footer actualizado */}
        <p className="text-center text-xs text-slate-400 mt-8 border-t border-slate-100 pt-4">
          © 2026 AuraDent · Sistema de Gestión Odontológica · v1.0
        </p>
      </div>
    </div>
  );
};

export default Login;