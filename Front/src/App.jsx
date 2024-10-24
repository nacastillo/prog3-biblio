import {useContext} from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import About from "./modules/About"
import Layout from './modules/Layout'
import Home from './modules/Home'
import NotFound from './modules/NotFound'
import Login from './modules/Login'
import Logout from './modules/Logout'
import { AuthContext } from "./components/AuthContext";
import { Libros, AltaLibro, BajaLibro } from './modules/Libros'
import { Prestamos, AltaPrestamo, BajaPrestamo } from './modules/Prestamos'
import { Generos, AltaGenero, BajaGenero } from './modules/Generos'
import { Roles, AltaRol, BajaRol } from './modules/Roles'
import { Usuarios, AltaUsuario, BajaUsuario } from './modules/Usuarios'
import Generos2 from "./modules/Generos/indexNuevo";

function App() {

    const {autenticado,esBiblio, esAdmin} = useContext(AuthContext);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            {autenticado ? 
                                <>                                
                                    <Route path={'libros'} element={<Libros />} />
                                    {(esAdmin() || esBiblio()) && <Route path="libros/nuevo" element={<AltaLibro />} />}
                                    <Route path="libros/buscar" element={<BajaLibro />} />
                                    <Route path={`prestamos`} element={<Prestamos />} />
                                    <Route path="prestamos/nuevo" element={<AltaPrestamo />} />
                                    <Route path="prestamos/buscar" element={<BajaPrestamo />} />
                                    <Route path={`generos`} element={<Generos />} />
                                    {(esAdmin() || esBiblio()) && <Route path="generos/nuevo" element={<AltaGenero />} />}
                                    <Route path="generos/buscar" element={<BajaGenero />} />
                                    {/* <Route path="generos2" element= {<Generos2 />} /> */}
                                    <Route path={`roles`} element={<Roles />} />
                                    {esAdmin() && <Route path="roles/nuevo" element={<AltaRol />} />}
                                    <Route path="roles/buscar" element={<BajaRol />} />
                                    <Route path={`usuarios`} element={<Usuarios />} />
                                    {(esAdmin() || esBiblio()) && <Route path="usuarios/nuevo" element={<AltaUsuario />} />}
                                    <Route path="usuarios/buscar" element={<BajaUsuario />} />
                                    <Route path="logout" element={<Logout />} />
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