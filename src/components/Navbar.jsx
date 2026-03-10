import {Link, useNavigate} from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link to="/" className="text-2xl font-bold text-blue-600">TicoAutos</Link>

                <div className="flex items-center gap-3">
                    {!token ? (
                    <>
                        <Link to="/register" className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition">
                            Registro
                        </Link>

                        <Link to="/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                            Login
                        </Link>
                    </>
                    ) : (
                        <>
                            <span className="hidden text-sm text-slate-600 md:block"> Hola, {user?.name}</span>
                            <button onClick={handleLogout} className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700">Cerrar sesión</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;