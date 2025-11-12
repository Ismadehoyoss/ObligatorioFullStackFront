import Contenedor from "./Contenedor";
import AltaPelicula from "./dashboard/AltaPelicula";
import ListadoPeliculas from "./dashboard/ListadoPeliculas";
import CambiarPlan from "./dashboard/CambiarPlan";
import GraficoGeneros from "./dashboard/GraficoGeneros";

const Dashboard = () => {
    return (
        <div className="container">
            <div className="dashboard-header-actions">
                <CambiarPlan onSuccess={() => window.location.reload()} />
            </div>

            <ListadoPeliculas />
            <GraficoGeneros />
            <hr className="dashboard-sep" />
        </div>
    )
}

export default Dashboard