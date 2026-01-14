import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import ClinicalRecords from './pages/ClinicalRecords';
import Odontogram from './pages/Odontogram'; // <--- IMPORTAR

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pacientes" element={<Patients />} />
      <Route path="/fichas" element={<ClinicalRecords />} />
      <Route path="/odontograma" element={<Odontogram />} /> {/* <--- NUEVA RUTA */}
    </Routes>
  );
}
export default App;