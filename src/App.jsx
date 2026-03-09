import {Routes, Route, Link} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="p-6">
        <Routes>
            <Route path="/" element={<h2 className="text-3xl font-bold text-center">¡Bienvenidos a TicoAutos!</h2>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>    
  );
}

export default App; 