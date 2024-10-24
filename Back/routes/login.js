const {generarToken} = require("../utils/jwtutils")
const { Router } = require('express');
const User = require('../schemas/user')
const Prestamo = require("../schemas/prestamo");

const router = new Router()

router.post('/', login)

async function login (req, res, next) {    
    /*  
    if (!req.body.email) {
      console.error('Missing email parameter. Sending 400 to client')
      return res.status(400).end()
    }  
    if (!req.body.password) {
      console.error('Missing password parameter. Sending 400 to client')
      return res.status(400).end()
    }
    */
    try {        
        const user = await User.findOne({ usr: req.body.usr }, '+pwd').populate("role");
        if (!user) {
            console.error('User not found. Sending 404 to client')
            return res.status(404).end()
        }
        console.log('Checking user password')
        const result = await user.checkPassword(req.body.pwd)
        if (result.isLocked) {
            console.error('User is locked. Sending 400 (Locked) to client')
            return res.status(400).end()
        }
        if (!result.isOk) {
            console.error('User password is invalid. Sending 401 to client')
            return res.status(401).end()
        }        
        
        const prestamos = await Prestamo.find({id_socio: user._id});        //console.log(prestamos);
        
        res.status(201).json(generarToken(user));
    } 
    catch (err) {
        next(err)
    }
}

module.exports = router