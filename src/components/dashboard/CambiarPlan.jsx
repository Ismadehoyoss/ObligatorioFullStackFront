import { useState, useEffect } from 'react';
import authApi from '../../data/authApi';
import { toast } from 'react-toastify';

const CambiarPlan = ({ onSuccess }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [planLoading, setPlanLoading] = useState(false);
    const [userPlan, setUserPlan] = useState(null);

    const getUserId = () => {
        let id = null;
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                id = u && (u._id || u.id) ? (u._id || u.id) : id;
            }
        } catch (e) {
            // ignore
        }
        if (!id) {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const parts = token.split('.')
                    if (parts.length >= 2) {
                        const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                        const json = JSON.parse(decodeURIComponent(atob(payload).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join('')));
                        id = json.sub || json.id || json._id || json.userId || id;
                    }
                }
            } catch (e) {
                // ignore
            }
        }
        return id;
    }

    const openModal = async () => {
        setOpen(true);
        setPlanLoading(true);
        const id = getUserId();
        if (!id) {
            setPlanLoading(false);
            toast.error('Usuario no identificado. Inicia sesión para cambiar el plan.');
            return;
        }

        try {
            const resp = await authApi.get(`/v1/usuarios/obtenerUso?id=${encodeURIComponent(id)}`);
            const data = resp?.data || {};
            setUserPlan(data.plan || null);
        } catch (err) {
            console.error('No se pudo obtener el plan del usuario', err);
            // leave userPlan null; allow attempt to change (backend will validate)
            toast.info('No se pudo verificar el plan. Puedes intentarlo de todos modos.');
        } finally {
            setPlanLoading(false);
        }
    };

    // On mount, try to detect current plan so the header button can reflect state
    useEffect(() => {
        let mounted = true;
        const fetchPlan = async () => {
            setPlanLoading(true);
            const id = getUserId();
            if (!id) {
                setPlanLoading(false);
                return;
            }
            try {
                const resp = await authApi.get(`/v1/usuarios/obtenerUso?id=${encodeURIComponent(id)}`);
                if (!mounted) return;
                const data = resp?.data || {};
                setUserPlan(data.plan || null);
            } catch (err) {
                console.error('No se pudo obtener el plan del usuario', err);
            } finally {
                if (mounted) setPlanLoading(false);
            }
        };
        fetchPlan();
        return () => { mounted = false; };
    }, []);
    const closeModal = () => setOpen(false);

    const comprarPlus = async () => {
        // Simplified flow: get user id from localStorage.user and POST { id, plan: 'premium' }
        setLoading(true);
        try {
            let id = null;
            // Prefer stored user object
            try {
                const raw = localStorage.getItem('user');
                if (raw) {
                    const u = JSON.parse(raw);
                    id = u && (u._id || u.id) ? (u._id || u.id) : id;
                }
            } catch (e) {
                // ignore
            }

            // Fallback: decode token payload if only token is saved
            if (!id) {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const parts = token.split('.');
                        if (parts.length >= 2) {
                            const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                            const json = JSON.parse(decodeURIComponent(atob(payload).split('').map(function (c) {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            }).join('')));
                            id = json.sub || json.id || json._id || json.userId || id;
                        }
                    }
                } catch (e) {
                    // ignore
                }
            }

            if (!id) {
                setLoading(false);
                toast.error('Usuario no identificado. Inicia sesión para cambiar el plan.');
                return;
            }

            // Backend requires plan to be 'premium' and user must currently be 'plus'
            const resp = await authApi.put('/v1/usuarios/cambiar-plan', { id, plan: 'premium' });
            toast.success((resp?.data && resp.data.message) || 'Plan cambiado a Premium');
            setLoading(false);
            setOpen(false);
            if (typeof onSuccess === 'function') onSuccess(resp.data);
        } catch (err) {
            console.error('Error cambiar plan', err);
            const msg = err?.response?.data?.message || 'No se pudo cambiar el plan';
            toast.error(msg);
            setLoading(false);
        }
    };

    return (
        <div className="cambiar-plan">
            <button
                className={`btn-comprar-plan ${userPlan === 'premium' ? 'premium' : ''}`}
                onClick={userPlan === 'premium' ? undefined : openModal}
                disabled={userPlan === 'premium'}
                aria-disabled={userPlan === 'premium'}
                title={userPlan === 'premium' ? 'Tu cuenta ya es Premium' : 'Comprar Plan'}
            >
                {userPlan === 'premium' ? (
                    <>
                        <i className="fa-solid fa-shield-check premium-icon" aria-hidden></i>
                        <span className="gradient-text">Cuenta Premium</span>
                    </>
                ) : (
                    'Comprar Plan'
                )}
            </button>

            {open && (
                <div className="modal-overlay cambiar-plan-overlay">
                    <div className="modal-dialog cambiar-plan-dialog">
                        <button className="modal-close" onClick={closeModal} title="Cerrar">×</button>
                        <div className="container auth-container">
                            <header>
                                <h2>Cambiar a Premium</h2>
                            </header>
                            <div className="cambiar-plan-body">
                                <p className="cambiar-plan-desc">Obtén Premium por una mejor experiencia y almacenamiento sin límites.</p>
                                <div className="cambiar-plan-price">5.99 USD</div>
                                {planLoading ? (
                                    <div className="pl-empty">Comprobando plan...</div>
                                ) : userPlan === 'premium' ? (
                                    <div className="pl-empty">Cuenta Premium — no es posible cambiar</div>
                                ) : (
                                    <div className="cambiar-plan-actions">
                                        <button className="btn-comprar-plan-cta" onClick={comprarPlus} disabled={loading}>
                                            {loading ? 'Procesando...' : 'Cambiar a Premium — $5.99'}
                                        </button>
                                        <button className="btn-secondary" onClick={closeModal} disabled={loading}>Cancelar</button>
                                    </div>
                                )}
                                <small className="cambiar-plan-note">Nota: Este es un flujo simulado. No se realizará ningún cobro real.</small>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CambiarPlan;
