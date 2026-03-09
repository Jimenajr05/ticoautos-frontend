import {useState} from "react";
import {register} from "../services/authService";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        lastName: "",
        age: "",
        phone: "",
        email: "",
        password: "",
        profileImage: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profileImage") {
            setForm({
                ...form,
                profileImage: files[0]
            });
        } else {
            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("lastName", form.lastName);
            formData.append("age", form.age);
            formData.append("phone", form.phone);
            formData.append("email", form.email);
            formData.append("password", form.password);

            if (form.profileImage) {
                formData.append("profileImage", form.profileImage);
            }

            const data = await register(formData);

            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));

            alert('¡Registro correcto!');
            navigate('/login');
            console.log(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Error al registrar');
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200 sm:p-10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">Crear cuenta</h2>
                    <p className="mt-2 text-slate-500">Registra un nuevo usuario en el sistema TicoAutos</p>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Nombre</label>
                        <input type="text" name="name" placeholder="" onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Apellido</label>
                        <input type="text" name="lastName" placeholder="" onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Edad</label>
                        <input type="number" name="age" placeholder="" onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Teléfono</label>
                        <input type="text" name="phone" placeholder="" onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Correo electrónico</label>
                        <input type="email" name="email" placeholder="" onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
                        <input type="password" name="password" placeholder="" onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">Foto de perfil</label>
                        <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3"/>
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition">Registrarse</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;