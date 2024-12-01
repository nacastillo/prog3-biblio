const {generarToken} = require("../utils/jwtutils")
const { Router } = require('express');
const User = require('../schemas/user')

const router = new Router()

router.post('/', login)

async function login (req, res, next) {
    try {        
        const user = await User.findOne({ usr: req.body.usr }, '+pwd').populate("role");
        if (!user) {
            console.error('User not found. Sending 404 to client')
            return res.status(404).send("usuario no encontrado")
        }
        console.log('Checking user password')
        if (await user.checkPassword(req.body.pwd)) {
            const token = generarToken(user)            
            console.log(token);
            return res.status(201).json(token);
        }
        else {
            return res.status(401).send("contraseña incorrecta");
        }
    } 
    catch (err) {
        return next(err)
    }
}

module.exports = router