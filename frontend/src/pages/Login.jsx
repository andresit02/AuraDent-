import { useState } from 'react';
import { loginUsuario } from '../services/authService'; // Importamos nuestro puente

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '' // OJO: En el backend se llama 'contrasena', debe coincidir
  });
  const [error, setError] = useState(''); // Para mostrar mensajes de error rojo
  const [loading, setLoading] = useState(false); // Para deshabilitar el botón mientras carga

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
      
      // 2. Si llegamos aquí, fue exitoso
      console.log('Login exitoso:', data);
      alert(`¡Bienvenido/a ${data.user.nombre}! 🦷`);
      
      // AQUI LUEGO REDIRECCIONAREMOS AL DASHBOARD
      // window.location.href = '/dashboard'; 
      
    } catch (err) {
      // 3. Si falló, mostramos el error
      console.error(err);
      setError(err.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">AuraDent 🦷</h1>
          <p className="text-gray-500 mt-2">Sistema de Gestión Odontológica</p>
        </div>

        {/* Mensaje de Error si existe */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Usuario
            </label>
            <input
              type="text"
              name="usuario"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Ej: dra_magda"
              value={formData.usuario}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="contrasena"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="********"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-2 px-4 rounded transition duration-300 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 AuraDent - Solo personal autorizado
        </p>
      </div>
    </div>
  );
};

export default Login;