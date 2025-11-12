import { Link } from "react-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registrarse } from "../features/user.slice";
import { useNavigate } from "react-router";
import {toast } from "react-toastify";
import authApi from '../data/authApi';
import axios from 'axios';
import { useTranslation } from "react-i18next";
const Registro = () => {
    
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {t , i18n} = useTranslation();
    const registrar = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (password !== confirmPassword) {
            toast.error(t("Las contraseñas no coinciden"));
            return;
        }
        if (!nombre || !password || !confirmPassword) {
            toast.error(t("Por favor, complete todos los campos."));
            return;
        }
        let usuarioNuevo = {
            nombre: nombre,
            password: password,
            confirmPassword: confirmPassword
        }
        try {
            const resp = await authApi.post('/v1/auth/register', usuarioNuevo);
            const token = resp.data?.token;
            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            dispatch(registrarse(resp.data));
            toast.success(t("Registro exitoso"));
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (error) {
            toast.error(t("Error en el registro: ") + (error.response?.data?.message || error.message) );

        }
        
    }

    return (
        <div className="container auth-container">
            <header>
                <h1><img src="/movie-logo.svg" className="logo-img" alt="logo" /> Registro</h1>
            </header>
            <form onSubmit={registrar}>
                <div className="form-group">
                        <label htmlFor="username">Usuario:</label>
                        <input type="text" id="username" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Repetir contraseña:</label>
                        <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {password && confirmPassword && password !== confirmPassword && (
                            <div style={{color: 'crimson', marginTop: '6px'}}>{t("Las contraseñas no coinciden")}</div>
                        )}
                </div>
                    <button type="submit" disabled={!password || password !== confirmPassword}>{t("Registrarse")}</button>
            </form>
            <p className="login-link">
                ¿Ya tienes cuenta? <Link to="/">{t("Ingresa aquí")}</Link>
            </p>
        </div>
    )
}


export default Registro