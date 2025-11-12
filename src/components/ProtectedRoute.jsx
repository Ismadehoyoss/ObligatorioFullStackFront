import { Navigate, Outlet } from "react-router";

// ProtectedRoute: comprobar token JWT en localStorage en lugar del store
const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/" replace />;

    try {
        const payload = JSON.parse(atob(token.split('.')[1] || ''));
        const now = Math.floor(Date.now() / 1000);
        // Si el token tiene exp y aún no expiró, permitir acceso
        if (payload && (!payload.exp || payload.exp > now)) {
            return <Outlet />;
        }
        // token expirado → limpiarlo
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/" replace />;
    } catch (e) {
        // token inválido → limpiar y redirigir
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;