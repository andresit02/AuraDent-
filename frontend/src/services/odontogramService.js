import axios from 'axios';

const API_URL = 'http://localhost:3004/api/odontograma';

// 1. Obtener el odontograma de un paciente
export const getOdontograma = async (pacienteId) => {
    try {
        const response = await axios.get(`${API_URL}/${pacienteId}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo odontograma:", error);
        throw error;
    }
};

// 2. Guardar (o actualizar) el odontograma
export const saveOdontograma = async (pacienteId, datosDientes) => {
    try {
        const payload = {
            paciente_id: pacienteId,
            datos_dientes: datosDientes
        };
        const response = await axios.post(API_URL, payload);
        return response.data;
    } catch (error) {
        console.error("Error guardando odontograma:", error);
        throw error;
    }
};