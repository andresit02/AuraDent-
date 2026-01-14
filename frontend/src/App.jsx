import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import ClinicalRecords from './pages/ClinicalRecords';
import Odontogram from './pages/Odontogram';
// IMPORTANTE: Ruta ajustada a tu carpeta components
import MainLayout from './components/MainLayout'; 

function App() {
  return (
    <Routes>
      {/* Login (Sin menú) */}
      <Route path="/" element={<Login />} />

      {/* Rutas Privadas (Con menú persistente) */}
      <Route path="/dashboard" element={ <MainLayout><Dashboard /></MainLayout> } />
      <Route path="/pacientes" element={ <MainLayout><Patients /></MainLayout> } />
      <Route path="/fichas" element={ <MainLayout><ClinicalRecords /></MainLayout> } />
      <Route path="/odontograma" element={ <MainLayout><Odontogram /></MainLayout> } />
    </Routes>
  );
}

export default App;