import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Layout from './modules/Layout'
import Home from './modules/Home'
import NotFound from './modules/NotFound'
import About from './modules/About'
import Login from './modules/Login'
import { Libros, AltaLibro, BajaLibro } from './modules/Libros'
import { Prestamos, AltaPrestamo, BajaPrestamo } from './modules/Prestamos'
import { Generos, AltaGenero, BajaGenero } from './modules/Generos'
import { Roles, AltaRol, BajaRol } from './modules/Roles'
import { Usuarios, AltaUsuario, BajaUsuario } from './modules/Usuarios'

// usar props para condicionar .modo para CRUD

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path={'libros'} element={<Libros />} />
                        <Route path="libros/alta" element={<AltaLibro />} />
                        <Route path="libros/baja" element={<BajaLibro />} />
                        <Route path={`prestamos`} element={<Prestamos />} />
                        <Route path="prestamos/alta" element={<AltaPrestamo />} />
                        <Route path="prestamos/baja" element={<BajaPrestamo />} />
                        <Route path={`generos`} element={<Generos />} />
                        <Route path="generos/alta" element={<AltaGenero />} />
                        <Route path="generos/baja" element={<BajaGenero />} />
                        <Route path={`roles`} element={<Roles />} />
                        <Route path="roles/alta" element={<AltaRol />} />
                        <Route path="roles/baja" element={<BajaRol />} />
                        <Route path={`usuarios`} element={<Usuarios />} />
                        <Route path="usuarios/alta" element={<AltaUsuario />} />
                        <Route path="usuarios/baja" element={<BajaUsuario />} />
                        <Route path="about" element={<About />} />
                        <Route path="login" element={<Login />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App