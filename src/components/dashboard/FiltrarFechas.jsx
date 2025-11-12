import React, { useState, useEffect } from 'react'

const FiltrarFechas = ({ value = 'all', onChange }) => {
    const [filter, setFilter] = useState(value);

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange({ filter });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }

    return (
        <div className="filtrar-fechas" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select name="filter" id="filter" value={filter} onChange={handleFilterChange}>
                <option value="all">Todo</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
            </select>
        </div>
    )
}

export default FiltrarFechas