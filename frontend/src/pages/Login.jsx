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
      
      // Opcional: Una pequeña alerta antes de cambiar (puedes quitarla si prefieres que sea inmediato)
      // alert(`¡Bienvenido/a ${data.user.nombre}!`);

      // 3. Redireccionar al Dashboard automáticamente
      navigate('/dashboard'); 
      
    } catch (err) {
      // 4. Si falla, mostramos el error
      console.error(err);
      // El backend puede devolver err.error (nuestro mensaje custom) o un error genérico
      setError(err.error || 'Error al iniciar sesión. Verifique sus credenciales.');
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

        {/* Mensaje de Error (solo se muestra si hay error) */}
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
            className={`w-full text-white font-bold py-2 px-4 rounded transition duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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