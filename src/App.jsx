import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import GestionarVehicle from "./pages/GestionarVehicle";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PublicHome from "./pages/PublicHome";
import VehicleDetail from "./pages/VehicleDetail";
import Chat from "./pages/Chat";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="p-6">
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/home" element={<Home />} />
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