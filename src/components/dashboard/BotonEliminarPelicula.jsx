import { useState } from 'react';
import authApi from '../../data/authApi';
import { toast } from 'react-toastify';

const BotonEliminarPelicula = ({ nombre, onDeleted }) => {
    const [loading, setLoading] = useState(false);

    const borrarPelicula = async () => {
        if (!nombre) {
            toast.error('No se pudo eliminar: falta el título de la película');
            return;
        }
        const ok = window.confirm(`¿Confirma que desea eliminar "${nombre}"?`);
        if (!ok) return;
        setLoading(true);
        try {
            // Backend expects 'titulo' in the body when deleting by title
            await authApi.delete('/v1/peliculas/baja', { data: { titulo: nombre } });
            toast.success('Película eliminada');
            if (onDeleted) onDeleted();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Error al eliminar película';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={borrarPelicula} className="btn-rojo" disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
    );
};

export default BotonEliminarPelicula;