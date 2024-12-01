const jwt = require("jsonwebtoken");
const SECRET = "final-programacion-tres-para-el-inspt";

function generarToken (obj) {
    process.stdout.write(`Creating user token for ${obj.usr}\n`);
    const token = jwt.sign(
        {
            user: obj.usr,
            id: obj._id,
            fullName: obj.fullName,
            rol: obj.role.name,
            penalizado: obj.penalizadoHasta
        },
        SECRET,
        {algorithm: "HS512"}
    );
    return `Bearer ${token}`;
}

function limpiarToken(token) {
    const TOKEN_REGEX = /^\s*Bearer\s+(\S+)/g
    const matches = TOKEN_REGEX.exec(token)
    if (matches) {
        return matches[1];        
    }
    else {
        throw new Error("Problema al limpiar token");        
    }    
}

function extraerInfo (token) {
    try {
        return jwt.verify(token,SECRET, {algorithms: ["HS512"]});
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    generarToken,
    limpiarToken,    
    extraerInfo
}