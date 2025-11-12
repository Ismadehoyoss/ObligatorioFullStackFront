

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import authApi from '../../data/authApi';
import { toast } from 'react-toastify';

const AltaPelicula = ({ onSuccess, onClose }) => {
    const [titulo, setTitulo] = useState('');
    const [director, setDirector] = useState('');
    const [duracion, setDuracion] = useState('');
    const [genero, setGenero] = useState('');
    const [generos, setGeneros] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // validación cliente
        if (!titulo.trim()) return setError('El título es obligatorio');
        if (!director.trim()) return setError('El director es obligatorio');
        const dur = Number(duracion);
        if (!dur || dur <= 0) return setError('La duración debe ser un número mayor que 0');
        // validar género seleccionado y formato ObjectId
        if (!genero) return setError('Por favor selecciona un género');
        if (!/^[0-9a-fA-F]{24}$/.test(genero)) return setError('Género inválido (ID incorrecto)');

        setLoading(true);
        try {
            const payload = { titulo: titulo.trim(), director: director.trim(), duracion: dur, genero };
            const resp = await authApi.post('/v1/peliculas/alta', payload);
            toast.success('Película creada exitosamente');
            if (typeof onSuccess === 'function') {
                onSuccess();
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            const status = err.response?.status;
            if (status === 403) {
                setError('Has alcanzado el límite de 10 películas para tu plan Plus. Considera actualizar a Premium.');
            } else {
                setError(err.response?.data?.error || err.response?.data?.message || 'Error al crear la película');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        const fetchGeneros = async () => {
            try {
                const resp = await authApi.get('/v1/generos');
                const list = resp.data?.generos || resp.data || [];
                if (!Array.isArray(list)) return;
                // map to a clear shape: { id, nombre }
                const mapped = list.map(g => ({ id: String(g._id), nombre: g.nombre }));
                if (mounted) setGeneros(mapped);
            } catch (err) {
                console.error('Error fetching generos', err);
            }
        };
        fetchGeneros();
        return () => { mounted = false };
    }, []);

    return (
        <div className="container auth-container">
            <header>
                <h1><img src="/movie-logo.svg" className="logo-img" alt="logo" /> Alta de Película</h1>
                {typeof onClose === 'function' && (
                    <button onClick={onClose} className="modal-close" aria-label="Cerrar">✕</button>
                )}
            </header>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="titulo">Título:</label>
                    <input id="titulo" type="text" value={titulo} onChange={e => setTitulo(e.target.value)} />

                    <label htmlFor="director">Director:</label>
                    <input id="director" type="text" value={director} onChange={e => setDirector(e.target.value)} />

                    <label htmlFor="duracion">Duración (minutos):</label>
                    <input id="duracion" type="number" value={duracion} onChange={e => setDuracion(e.target.value)} />

                    <label htmlFor="genero">Género:</label>
                    <select id="genero" value={genero} onChange={e => setGenero(e.target.value)}>
                        <option value="">Seleccione un género</option>
                            {generos.map(g => (
                                <option key={g.id} value={g.id}>{g.nombre}</option>
                            ))}
                    </select>

                    {error && <div className="error" style={{ color: 'crimson', marginTop: '8px' }}>{error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '12px' }}>
                        {loading ? 'Creando...' : 'Crear Película'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AltaPelicula;
