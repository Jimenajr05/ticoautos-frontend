import {Routes, Route, Link} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <div style = {{padding: '20px'}}>
      <nav style = {{marginBottom: '20px'}}>
       <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
       <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h2>Welcome to TicoAutos!</h2>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App; 