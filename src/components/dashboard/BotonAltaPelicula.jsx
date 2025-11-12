
import { useNavigate } from 'react-router';

const BotonAltaPelicula = ({ onOpen }) => {
    const navigate = useNavigate();
    const irAltaPelicula = () => {
        if (typeof onOpen === 'function') return onOpen();
        navigate('/dashboard/alta');
    }

    return (
        <div>
            <button className="alta-btn" aria-label="Alta Película" onClick={irAltaPelicula}>Alta Película</button>
        </div>

    )

}
export default BotonAltaPelicula