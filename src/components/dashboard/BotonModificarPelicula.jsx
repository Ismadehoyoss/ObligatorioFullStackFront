import { useNavigate } from "react-router"

const BotonModificarPelicula = ({ pelicula = null, onOpen }) => {
    const navigate = useNavigate();
    const modificarPelicula = () => {
        if (typeof onOpen === 'function') return onOpen(pelicula);
        navigate('/dashboard/modificar');
    }
    




    return (
        <button onClick={modificarPelicula} className="btn-modificar">Modificar</button>
    )
}

export default BotonModificarPelicula



