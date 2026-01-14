import axios from 'axios';

// URL del Microservicio de Fichas (Puerto 3003)
const API_URL = 'http://localhost:3003/api/fichas';

export const getFichas = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo fichas:", error);
        throw error;
    }
};

export const createFicha = async (fichaData) => {
    try {
        const response = await axios.post(API_URL, fichaData);
        return response.data;
    } catch (error) {
        console.error("Error creando ficha:", error);
        throw error;
    }
};