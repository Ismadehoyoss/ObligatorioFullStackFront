import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import authApi from '../../data/authApi';

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultColors = [
    '#F6D1E8', '#FFD59E', '#CFE7FF', '#C8F7C5', '#FFE8A1', '#E3D2FF', '#DFF6E6', '#FFB6C1'
];

const GraficoGeneros = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // load function reused on mount and when peliculas change
    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const resp = await authApi.get('/v1/peliculas/listar');
            const list = resp.data?.peliculas || resp.data || [];
            const arr = Array.isArray(list) ? list : [];

            // count by genero name
            const counts = {};
            arr.forEach(p => {
                const name = (p.genero && (p.genero.nombre || p.genero)) || 'Sin género';
                const key = typeof name === 'string' ? name : String(name);
                counts[key] = (counts[key] || 0) + 1;
            });

            // sort and take top 6, rest -> Otros
            const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            const top = entries.slice(0, 6);
            const others = entries.slice(6);
            const labels = top.map(e => e[0]);
            const values = top.map(e => e[1]);
            if (others.length) {
                const sumOthers = others.reduce((s, e) => s + e[1], 0);
                labels.push('Otros');
                values.push(sumOthers);
            }

            const colors = labels.map((_, i) => defaultColors[i % defaultColors.length]);

            setData({ labels, datasets: [{ data: values, backgroundColor: colors }] });
        } catch (err) {
            console.error('Error cargando peliculas para grafico', err);
            setError('No se pudo cargar datos para el gráfico');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        const onChange = () => { load(); };
        window.addEventListener('peliculas:changed', onChange);
        return () => { window.removeEventListener('peliculas:changed', onChange); };
    }, []);

    if (loading) return <div className="grafico-generos">Cargando gráfico...</div>;
    if (error) return <div className="grafico-generos error">{error}</div>;
    if (!data || (data.datasets[0].data.every(v => v === 0) || data.labels.length === 0)) {
        return <div className="grafico-generos pl-empty">No hay películas para graficar</div>;
    }

    const options = {
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 10,
                    padding: 12,
                    color: '#8a8a8a',
                    font: { size: 12 }
                }
            },
            tooltip: {
                padding: 8,
                bodyColor: '#ffffffff',
                titleColor: '#ffffffff'
            }
        },
        elements: {
            arc: { borderWidth: 0 }
        }
    };

    return (
        <div className="grafico-generos grafico-card">
            <h3>Películas por género</h3>
            <div className="grafico-content">
                <div className="grafico-canvas">
                    <Doughnut data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default GraficoGeneros;
