import axios from 'axios';

const API_URL = 'http://localhost:3003/api';

// Configurar axios para incluir token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones para FICHAS
export const getFichas = async () => {
  const response = await axios.get(`${API_URL}/fichas`);
  return response.data;
};

export const createFicha = async (fichaData) => {
  const response = await axios.post(`${API_URL}/fichas`, fichaData);
  return response.data;
};

// Funciones para PRESUPUESTOS
export const getPresupuestoByFicha = async (fichaId) => {
  try {
    const response = await axios.get(`${API_URL}/fichas/${fichaId}/presupuesto`);
    return response.data;
  } catch (error) {
    // Si no existe presupuesto, el backend devuelve 404
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createPresupuesto = async (presupuestoData) => {
  const response = await axios.post(`${API_URL}/presupuestos`, presupuestoData);
  return response.data;
};

export const updatePresupuesto = async (id, presupuestoData) => {
  const response = await axios.put(`${API_URL}/presupuestos/${id}`, presupuestoData);
  return response.data;
};

// Funciones para PAGOS
export const getPagosByPresupuesto = async (presupuestoId) => {
  try {
    const response = await axios.get(`${API_URL}/presupuestos/${presupuestoId}/pagos`);
    return response.data;
  } catch (error) {
    // Si no hay pagos, devolver array vacío
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

export const createPago = async (pagoData) => {
  const response = await axios.post(`${API_URL}/pagos`, pagoData);
  return response.data;
};

export const deletePago = async (pagoId) => {
  const response = await axios.delete(`${API_URL}/pagos/${pagoId}`);
  return response.data;
};

// Función auxiliar para calcular totales
export const calcularTotalesPagos = (pagos) => {
  return pagos.reduce((total, pago) => total + parseFloat(pago.monto || 0), 0);
};