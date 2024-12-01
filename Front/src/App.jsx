import {useContext} from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import About from "./modules/About"
import Layout from './modules/Layout'
import NotFound from './modules/NotFound'
import Login from './modules/Login'
import Logout from './modules/Logout'
import { AuthContext } from "./components/AuthContext";
import { Libros, AltaLibro, BajaLibro } from './modules/Libros'
import { Prestamos, AltaPrestamo, BajaPrestamo } from './modules/Prestamos'
import { Generos, AltaGenero, BajaGenero } from './modules/Generos'
import { Roles, AltaRol, BajaRol } from './modules/Roles'
import { Usuarios, AltaUsuario, BajaUsuario } from './modules/Usuarios'
import MisPrestamos from "./modules/MisPrestamos";

function App() {

    const {autenticado,esBiblio, esAdmin} = useContext(AuthContext);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <>
                            <Route path="/" element={<About />} />
                            <Route path="/about" element={<About />} />
                            {autenticado ? 
                                <>                                
                                    <Route path={'libros'} element={<Libros />} />
                                    {(esAdmin() || esBiblio()) && <Route path="libros/nuevo" element={<AltaLibro />} />}
                                    {(esAdmin() || esBiblio()) && <Route path="libros/buscar" element={<BajaLibro />} />}
                                    {(esAdmin() || esBiblio()) && <Route path="prestamos" element={<Prestamos />} />}
                                    {(esAdmin() || esBiblio()) && <Route path="prestamos/nuevo" element={<AltaPrestamo />} />}
                                    {(esAdmin() || esBiblio()) && <Route path="prestamos/buscar" element={<BajaPrestamo />} />}
                                    <Route path={`misprestamos`} element={<MisPrestamos />} />
                                    {(esAdmin() || esBiblio()) && <Route path={`generos`} element={<Generos />} />}
                                    {(esAdmin() || esBiblio()) && <Route path="generos/nuevo" element={<AltaGenero />} />}
                                    {(esAdmin() || esBiblio()) && <Route path="generos/buscar" element={<BajaGenero />} />}
                                    {esAdmin() && <Route path="roles" element={<Roles />} />}
                                    {esAdmin() && <Route path="roles/nuevo" element={<AltaRol />} />}
                                    {esAdmin() && <Route path="roles/buscar" element={<BajaRol />} />}
                                    {(esAdmin() || esBiblio()) && <Route path={`usuarios`} element={<Usuarios />} />}
                                    {(esAdmin() || esBiblio()) && <Route path="usuarios/nuevo" element={<AltaUsuario />} />}
                                    {(esAdmin() || esBiblio()) && <Route path="usuarios/buscar" element={<BajaUsuario />} />}
                                    <Route path="logout" element={<Logout />}/>
                                </>
                                :                                                            
                                <Route path="login" element={<Login />} />
                            }                        
                            <Route path="*" element={<NotFound />} />
                        </>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App