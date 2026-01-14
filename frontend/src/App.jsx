import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import ClinicalRecords from './pages/ClinicalRecords'; // <--- IMPORTAR

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pacientes" element={<Patients />} />
      <Route path="/fichas" element={<ClinicalRecords />} /> {/* <--- NUEVA RUTA */}
    </Routes>
  );
}
export default App;