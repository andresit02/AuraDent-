import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* Ruta por defecto: Login */}
      <Route path="/" element={<Login />} />
      
      {/* Ruta del Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;