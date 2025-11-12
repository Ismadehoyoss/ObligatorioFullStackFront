import { useDispatch, useSelector } from "react-redux"
import { Link, NavLink, Outlet } from "react-router"
import { useNavigate } from "react-router";
import { useEffect } from 'react';
import { desloguear, loguear } from "../features/user.slice";
import { useTranslation } from "react-i18next";


const Contenedor = () => {

    const { t, i18n } = useTranslation();

    const logueado = useSelector(state => state.user.logged);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const cerrarSesion = () => {
        localStorage.clear();
        dispatch(desloguear())
        navigate("/");
    }

    // On mount, if a token exists in localStorage, mark user as logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(loguear());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cambiarIdioma = e => {
        i18n.changeLanguage(e.target.value);
    }

    return (
        <>
            <header className="main-header">
                <div className="header-content">
                    <a href="/dashboard" className="app-logo">
                        <img src="/movie-logo.svg" alt="logo" className="logo-img" />
                        <span>{t("name")}</span>
                    </a>
                    <select onChange={cambiarIdioma}>
                        <option value="es">Español</option>
                        <option value="en">English</option>
                    </select>
                    {logueado && (
                        <button className="logout-btn" onClick={cerrarSesion} title="Cerrar sesión">
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    )}




                </div>
            </header>

            <Outlet />

        </>
    )
}

export default Contenedor


/*     < nav >
    <NavLink to="/">Inicio</NavLink> |
    <NavLink to="/registro">Registro</NavLink> |
    <NavLink to="/dashboard">Dashboard</NavLink> | 
                    </ nav> */