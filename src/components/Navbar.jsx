import {Link} from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-white shadow-sm border-b border-slate-200">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
                <Link to="/" className="text-2xl font-bold text-blue-600">TicoAutos</Link>

                <div className="flex gap-3">
                    <Link to="/register" className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition">
                        Registro
                    </Link>
                    <Link to="/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;