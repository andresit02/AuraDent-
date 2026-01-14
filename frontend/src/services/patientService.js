import axios from 'axios';

// URL del Microservicio de Pacientes (Puerto 3002)
const API_URL = 'http://localhost:3002/api/pacientes';

// 1. Obtener todos los pacientes
export const getPacientes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        throw error;
    }
};

// 2. Crear un nuevo paciente
export const createPaciente = async (pacienteData) => {
    try {
        const response = await axios.post(API_URL, pacienteData);
        return response.data;
    } catch (error) {
        console.error("Error al crear paciente:", error);
        throw error;
    }
};