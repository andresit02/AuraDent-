import { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos a enviar al backend:', formData);
    alert('Intentando iniciar sesión (Aún falta conectar el backend)');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">AuraDent 🦷</h1>
          <p className="text-gray-500 mt-2">Sistema de Gestión Odontológica</p>
        </div>

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
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Ingresar
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