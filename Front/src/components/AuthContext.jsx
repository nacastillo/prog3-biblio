import {createContext, useEffect, useState} from "react";
//import jwt_decode from "jwt-decode";
import {jwtDecode} from "jwt-decode";
import serv from "../services/librapi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [autenticado, setAutenticado] = useState( () => {
        const token = localStorage.getItem("nicastillo.prog3");
        return !!token;
    });

    const checkAuth = () => {
        const token = localStorage.getItem("nicastillo.prog3");
        setAutenticado(!!token);
    };

    async function login (u,p) {
        try {
            const token = await serv.login(u,p);
            localStorage.setItem("nicastillo.prog3", token);
            setAutenticado(true);
        }
        catch (err) {
            console.error(err);   
            //console.log(`Error ${err.response.status}: ${err.message}`)
            throw new Error(`Error ${err.response.status}: ${err.message}`);
        }
    }

    function logout () {
        localStorage.removeItem("nicastillo.prog3");
        setAutenticado(false);
    }

    function getFullName () {
        if (autenticado) {
            const decoded = jwt_decode(localStorage.getItem("nicastillo.prog3"));
            return decoded.fullName;
        }
    }

    function getPrestamos () {
        if (autenticado) {
            const decoded = jwt_decode(localStorage.getItem("nicastillo.prog3"));
            return decoded.prestamos;
        }        
    }

    function getRol () {
        if (autenticado) {
            const decoded = jwt_decode(localStorage.getItem("nicastillo.prog3"));
            return decoded.rol;
        }
        else {
            return "";
        }
    }

    function esSocio () {        
        return getRol() === "Socio";
    }

    function esBiblio () {
        return getRol() === "Bibliotecario";        
    }

    function esAdmin () {
        return getRol() === "Administrador";        
    }

    useEffect ( () => {
        checkAuth();
        window.addEventListener("storage",checkAuth);
        return () => {
            window.removeEventListener("storage",checkAuth);
        };
    }, []);

    return (
        <AuthContext.Provider value = {{
            autenticado,
            login,
            logout,
            getFullName,
            getPrestamos,
            esSocio,
            esBiblio,
            esAdmin}}
        >
            {children}
        </AuthContext.Provider>
    );
}
