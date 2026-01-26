// patientService.js
import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPacientes = async () => {
  const response = await axios.get(`${API_URL}/pacientes`);
  return response.data;
};

export const createPaciente = async (pacienteData) => {
  const response = await axios.post(`${API_URL}/pacientes`, pacienteData);
  return response.data;
};

export const updatePaciente = async (id, pacienteData) => {
  const response = await axios.put(`${API_URL}/pacientes/${id}`, pacienteData);
  return response.data;
};

export const deletePaciente = async (id) => {
  const response = await axios.delete(`${API_URL}/pacientes/${id}`);
  return response.data;
};