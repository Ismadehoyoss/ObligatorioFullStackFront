import { useEffect, useState } from 'react';
import authApi from '../../data/authApi';
import { toast } from 'react-toastify';
import BotonEliminarPelicula from './BotonEliminarPelicula';
import BotonModificarPelicula from './BotonModificarPelicula';
import ModificarPelicula from './ModificarPelicula';
import FiltrarFechas from './FiltrarFechas';
import BotonAltaPelicula from './BotonAltaPelicula';
import AltaPelicula from './AltaPelicula';
import PlanUsage from './PlanUsage';

const ListadoPeliculas = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [showAlta, setShowAlta] = useState(false);
    const [showModificar, setShowModificar] = useState(false);
    const [selectedPelicula, setSelectedPelicula] = useState(null);

    const fetchPeliculas = async () => {
        setLoading(true);
        setError('');
        try {
            const resp = await authApi.get('/v1/peliculas/listar');
            const list = resp.data?.peliculas || resp.data || [];

            const arr = Array.isArray(list) ? list : [];

            const normalizeDate = (p) => {
                let raw = p.createdAt ?? p.updatedAt ?? p.fecha ?? p.date;
                if (!raw) return null;

                if (typeof raw === 'object') {
                    if (raw.$date) {
                        if (typeof raw.$date === 'object' && raw.$date.$numberLong) raw = Number(raw.$date.$numberLong);
                        else raw = raw.$date;
                    } else if (raw.$numberLong) {
                        raw = Number(raw.$numberLong);
                    }
                }

                if (typeof raw === 'string' && /^\d+$/.test(raw)) raw = Number(raw);
                const d = new Date(raw);
                return isNaN(d) ? null : d.getTime(); 
            };
            const normalized = arr.map(p => ({ ...p, __dateMs: normalizeDate(p) }));

                setPeliculas(normalized);

                try { window.dispatchEvent(new CustomEvent('peliculas:changed')); } catch (e) { /* noop */ }
        } catch (err) {
            console.error('Error fetching peliculas', err);
            const msg = err.response?.data?.message || err.response?.data?.error || 'Error al obtener películas';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        fetchPeliculas();
        return () => { mounted = false };

    }, []);

    if (loading) return <div>Cargando películas...</div>;
    if (error) return <div className="error" style={{ color: 'crimson' }}>{error}</div>;


    const parseMovieDate = (p) => (p.__dateMs ? new Date(p.__dateMs) : null);


    const DAY = 24 * 60 * 60 * 1000;
    const nowMs = Date.now();
    let startMs = null;
    if (filter === 'week') {
        startMs = nowMs - 7 * DAY;
    } else if (filter === 'month') {

        startMs = nowMs - 30 * DAY;
    }

    const filtered = peliculas.filter(p => {
        if (filter === 'all') return true;
        const t = p.__dateMs;
        if (!t) return false;
        if (isNaN(t)) return false;
        if (!startMs) return true;
        return t >= startMs && t <= nowMs;
    });

    const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    return (
        <div className="peliculas-list">
            <h2 className="pl-title">Mis películas</h2>
            <div className="pl-controls">
                <FiltrarFechas value={filter} onChange={({ filter: f }) => setFilter(f)} />
            </div>
            <div>
                <BotonAltaPelicula onOpen={() => setShowAlta(true)} />
            </div>

            {showAlta && (
                <div className="modal-overlay" role="dialog" aria-modal="true">
                    <div className="modal-dialog">
                        <AltaPelicula onSuccess={() => { setShowAlta(false); fetchPeliculas(); }} onClose={() => setShowAlta(false)} />
                    </div>
                </div>
            )}

            {showModificar && (
                <div className="modal-overlay" role="dialog" aria-modal="true">
                    <div className="modal-dialog">
                        <ModificarPelicula pelicula={selectedPelicula} onSuccess={() => { setShowModificar(false); fetchPeliculas(); }} onClose={() => setShowModificar(false)} />
                    </div>
                </div>
            )}

            <PlanUsage userId={userId} />

            {filtered.length === 0 ? (
                <div className="pl-empty">No hay películas para el filtro seleccionado. Usa el formulario para crear una.</div>
            ) : (
                <div className="peliculas-grid">
                    {filtered.map(p => (
                        <article key={p._id || p.id} className="pelicula-card">
                            <div className="pelicula-body">
                                <div className="pelicula-poster" aria-hidden>
                                    <img
                                        className="poster-img"
                                        src={p.posterUrl || p.poster || '/generic-poster.svg'}
                                        alt={`${p.titulo} poster`}
                                    />
                                </div>
                                <div className="pelicula-content">
                                    <header className="pelicula-head">
                                        <h3 className="pelicula-title">{p.titulo}</h3>
                                        <div className="pelicula-meta">{p.director} — {p.duracion} min</div>
                                        <div className="pelicula-genero">{p.genero?.nombre || p.genero || ''}</div>
                                    </header>
                                    <div className="pelicula-date">
                                        {(() => {
                                            const d = parseMovieDate(p);
                                            if (d) return d.toLocaleString();

                                            try {
                                                return p.createdAt ? (typeof p.createdAt === 'string' ? new Date(p.createdAt).toLocaleString() : JSON.stringify(p.createdAt)) : '';
                                            } catch (e) {
                                                return '';
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="pelicula-actions">
                                <BotonEliminarPelicula nombre={p.titulo || p.nombre} onDeleted={() => fetchPeliculas()} />
                                <button className="btn-modificar" onClick={() => { setSelectedPelicula(p); setShowModificar(true); }}>Modificar</button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ListadoPeliculas;