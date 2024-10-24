const jwt = require("jsonwebtoken");
const SECRET = "final-programacion-tres-para-el-inspt";

function generarToken (obj) {
    process.stdout.write(`Creating user token for ${obj.usr}\n`);
    return jwt.sign(
        {
            user: obj.usr,
            id: obj._id,
            fullName: obj.fullName,
            rol: obj.role.name        
        },
        SECRET
    );
}

function limpiarToken(req, next) {
    const TOKEN_REGEX = /^\s*Bearer\s+(\S+)/g
    const matches = TOKEN_REGEX.exec(req.headers.authorization)

    if (!matches) {
        return next(new createError.Unauthorized())
    }

    //const [, token] = matches
    const token = matches[1];
    return token
}

function validarToken (token) {
    try {
        return !!jwt.verify(token,SECRET, {algorithms: ["HS256"]});        
    }
    catch (err) {
        return false;
    }
}

module.exports = {
    generarToken,
    validarToken
}