import { useRef } from "react"
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router"
import { loguear } from "../features/user.slice";
import { toast } from "react-toastify";
import authApi from '../data/authApi';
import axios from 'axios';
import { useTranslation } from "react-i18next";
const Login = () => {

    const campo = useRef(null);
    const refCampopassword = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = async (e) => {
        e.preventDefault();
        let username = campo.current.value;
        let password = refCampopassword.current.value;
        if (!username || !password) {
            toast.error("Por favor, complete todos los campos.");
            return;
        }
        let usuario = {
            nombre: username,
            password: password
        };
        try {
            const resp = await authApi.post('/v1/auth/login', usuario);
            console.log(resp);
            const token = resp.data?.token;
            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                toast.success('Login exitoso');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            }
            dispatch(loguear());
        } catch (error) {
            console.log(error);
            toast.error("Error en el login: " + (error.response?.data?.message || error.message));
            return;
        }
    }

    return (
        <div className="container auth-container">
            <header>
                <h1><img src="/movie-logo.svg" className="logo-img" alt="logo" /> Login</h1>
            </header>
            <form onSubmit={login}>
                <div className="form-group">
                    <label htmlFor="username">Usuario:</label>
                    <input type="text" id="username" ref={campo} />
                    <span className="error">Este campo es obligatorio</span>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" ref={refCampopassword} />
                    <span className="error">Este campo es obligatorio</span>
                </div>
                <button type="submit" className="btn btn-primary">
                    Ingresar
                </button>
            </form>
            <p className="register-link">
                ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>
        </div>

    )
}

export default Login