import {Routes, Route, Link} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import GestionarVehicle from './pages/GestionarVehicle';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VehicleDetail from "./pages/VehicleDetail";
import Chat from "./pages/Chat";

function Perfil() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Información del usuario</h2>
        <p><strong>Nombre:</strong> {user?.nombre || "No disponible"}</p>
        <p><strong>Correo:</strong> {user?.correo || "No disponible"}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mis-vehiculos" element={<GestionarVehicle />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;