import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-cyan-400">
          TicoAutos
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hover:text-cyan-300 transition"
          >
            Inicio
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition"
              >
                {user.nombre || "Usuario"} ⌄
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
                  <Link
                    to="/perfil"
                    className="block px-4 py-3 hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Información del usuario
                  </Link>

                  <Link
                    to="/mis-vehiculos"
                    className="block px-4 py-3 hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mis vehículos
                  </Link>

                  <Link
                    to="/chat"
                    className="block px-4 py-3 hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Chat con usuarios
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-100 text-red-600"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition"
              >
                Registro
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;