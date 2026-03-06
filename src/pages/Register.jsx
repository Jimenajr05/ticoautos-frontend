import {useState} from "react";
import {register} from "../services/authService";

function Register() {
    const [form, setForm] = useState({
        name: "",
        lastName: "",
        age: "",
        phone: "",
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
            const data = await register(form);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('¡Registro correcto!');
            console.log(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Error al registrar');
        }
    };

    return (
        <div>
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required /> <br /> <br />
                <input type="text" name="lastName" placeholder="Apellido" onChange={handleChange} required /> <br /> <br />
                <input type="number" name="age" placeholder="Edad" onChange={handleChange} required /> <br /> <br />
                <input type="tel" name="phone" placeholder="Teléfono" onChange={handleChange} required /> <br /> <br />
                <input type= "email" name="email" placeholder="Email" onChange={handleChange} required /> <br /> <br />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required /><br /> <br />

                <button type="submit">Registrarse</button>
            </form> 
        </div>
    
    );
}

export default Register;