const jwtutils = require("../utils/jwtutils");

function auth (req, res, next ) {
    const token = req.headers["authorization"];
    if (!token) {
        console.error("Token ausente")
        const customError = {
            codigo: 10,
            mensaje: "Token ausente"
        }        
        return res.status(401).send(customError);
    }
    try {
        const info = jwtutils.extraerInfo(jwtutils.limpiarToken(token));        
        req.userInfo = {};
        req.userInfo.esAdmin = info.rol === "Administrador"        
        req.userInfo.estaAutorizado = info.rol === "Administrador" || info.rol === "Bibliotecario";        
        next();
    }
    catch (err) {        
        console.error("Token inválido");
        const customError = {
            codigo: 20,
            mensaje: "Token inválido"
        }
        return res.status(401).send(customError);
    }
}

module.exports = auth