import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 px-6 py-4 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-cyan-400">
          TicoAutos
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg bg-slate-800 px-4 py-2 transition hover:bg-slate-700"
              >
                {user.name || user.nombre || "Usuario"} ⌄
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg bg-white text-black shadow-lg">
                  <Link to="/home" className="block px-4 py-3 hover:bg-slate-100">
                    Inicio
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
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-100"
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
                className="rounded-lg bg-cyan-500 px-4 py-2 transition hover:bg-cyan-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-slate-700 px-4 py-2 transition hover:bg-slate-600"
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