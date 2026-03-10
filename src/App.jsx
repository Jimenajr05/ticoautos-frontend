import {Routes, Route, Link} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import GestionarVehicle from './pages/GestionarVehicle';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="p-6">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/gestionarVehicle" element={<GestionarVehicle />} />
        </Routes>
      </div>
    </div>    
  );
}

export default App; 