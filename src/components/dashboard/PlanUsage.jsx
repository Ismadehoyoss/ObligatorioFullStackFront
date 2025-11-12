import { useEffect, useState } from 'react';
import authApi from '../../data/authApi';
import { toast } from 'react-toastify';

const PlanUsage = ({ userId: propUserId }) => {
    const [loading, setLoading] = useState(false);
    const [planInfo, setPlanInfo] = useState(null);

    // prefer prop userId but fall back to localStorage 'user' or decode token if available
    const userId = (() => {
        if (propUserId) return propUserId;
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                if (u && u._id) return u._id;
                if (u && u.id) return u.id;
            }
        } catch (e) {
            // ignore
        }
        // try decode token payload (no verification) to extract a likely id field
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const json = JSON.parse(decodeURIComponent(atob(payload).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')));
            // common claim names
            return json.sub || json.id || json._id || json.userId || null;
        } catch (e) {
            return null;
        }
    })();

    useEffect(() => {
        if (!userId) return;
        const load = async () => {
            setLoading(true);
            try {
                const resp = await authApi.get(`/v1/usuarios/obtenerUso?id=${encodeURIComponent(userId)}`);
                // espera: { plan, peliculasCreadas }
                const data = resp.data;
                setPlanInfo({
                    plan: data.plan,
                    peliculasCreadas: data.peliculasCreadas ?? 0,
                    limit: data.limit ?? 10 // si el backend no devuelve limit, usamos 10 para 'plus'
                });
            } catch (err) {
                console.error('Error al cargar uso', err);
                toast.error('No se pudo cargar el uso de la cuenta');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userId]);

    if (loading || !planInfo) return <div className="plan-usage">Cargando uso...</div>;

    const { plan, peliculasCreadas, limit } = planInfo;
    const isPlus = String(plan).toLowerCase() === 'plus';
    const rawPct = isPlus && limit ? Math.round((peliculasCreadas / limit) * 100) : 0;
    const pct = Math.min(100, Math.max(0, rawPct));
    // Round to nearest 5 for class-based width handling (no inline styles in JSX)
    const pctRounded = Math.round(pct / 5) * 5;
    const small = pct < 20;

    return (
        <div className="plan-usage card">
            <h3>Uso de la cuenta</h3>

            {isPlus ? (
                <div className="plan-usage-plus">
                    <div className="plan-usage-track" aria-hidden>
                        <div className={`plan-usage-fill pct-${pctRounded} ${small ? 'small' : ''}`}>
                            <span className="plan-usage-label">{`${pct}%`}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="plan-usage-premium">
                    <div className="plan-usage-count">{peliculasCreadas} documentos</div>
                    <div className="plan-usage-sub">Almacenamiento ilimitado</div>
                </div>
            )}
        </div>
    );
};

export default PlanUsage;