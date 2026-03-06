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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type= "email" name="email" placeholder="Email" onChange={handleChange} required /> <br /> <br />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required /><br /> <br />

                <button type="submit">Iniciar Sesión</button>
            </form> 
        </div>
    
    );
}

export default Login;