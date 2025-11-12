import Login from './components/Login'
import Registro from './components/Registro'
import Dashboard from './components/Dashboard'
import AltaPelicula from './components/dashboard/AltaPelicula'
import Contenedor from './components/Contenedor'
import { BrowserRouter, Routes, Route } from 'react-router'
import './styles.css'
import "react-toastify/dist/ReactToastify.css";
import NoEncontrado from './components/NoEncontrado'
import { Provider } from 'react-redux'
import { store } from './store/store'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import ModificarPelicula from './components/dashboard/ModificarPelicula'

const App = () => {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Contenedor />}>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/alta" element={<AltaPelicula />} />
              <Route path="/dashboard/modificar" element={<ModificarPelicula />} />
            </Route>
            <Route path="*" element={<NoEncontrado />} />
          </Route>
          {/* <Login />
        <Registro />
        <Dashboard /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right"
        autoClose={5000}
        pauseOnHover
        theme="colored" />
    </Provider>
  )
}

export default App
