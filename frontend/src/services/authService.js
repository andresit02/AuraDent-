import axios from 'axios';

// La URL de tu microservicio de seguridad
const API_URL = 'http://localhost:3001/api/auth';

export const loginUsuario = async (credentials) => {
    try {
        // Enviamos usuario y contraseña al backend
        const response = await axios.post(`${API_URL}/login`, credentials);
        
        // Si el login es correcto, el backend devuelve un TOKEN y el USER
        if (response.data.token) {
            // Guardamos el token en la "memoria local" del navegador para no perderlo al recargar
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    } catch (error) {
        // Si hay error, lo lanzamos para que la pantalla de Login sepa qué decir
        throw error.response ? error.response.data : { error: 'Error de conexión con el servidor' };
    }
};

export const logoutUsuario = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};