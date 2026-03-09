import {useState} from "react";
import {login} from "../services/authService";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await login(form);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('¡Login correcto!');
            console.log(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 md:grid-cols-2">
                <div className="hidden bg-gradient-to-br from-blue-700 to-slate-900 p-10 text-white md:flex md:flex-col md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">Bienvenido a TicoAutos</h2>
                    </div>
                </div>
        
                <div className="p-8 sm:p-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Iniciar sesión</h2>
                        <p className="mt-2 text-slate-500">Ingresa tus credenciales para continuar</p>
                    </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Correo electrónico</label>
                                <input type="email" name="email" placeholder="" onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
                                <input type="password" name="password" placeholder="" onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                            </div>
                            
                            <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700">Entrar al sistema</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;