const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../schemas/user')
const Role = require('../schemas/role')

const router = express.Router()
router.get('/', getAllUsers)
router.get("/getByRol/:id", getByRol)
router.post('/', crearUser)
router.get('/:id', leerUser)
router.put("/penalizar/:id", penalizarUser);
router.put('/:id', actualizarUser)
router.delete('/:id', borrarUser)

async function penalizarUser (req, res, next) {    
    if (!req.params.id) {
        return res.status(400).send('Falta ID');
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {
        const user = await User.findById(req.params.id).populate("role");
        if (!user) {
            return res.status(404).send("Usuario no encontrado");            
        }
        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);
        hoy.setUTCHours(hoy.getUTCHours() - 3);
        await user.updateOne({penalizadoHasta: new Date(hoy.getTime() + 15 * 86400000)});
        return res.send(user);
    }
    catch (err) {
        return next(err);
    }        
}

async function getByRol (req, res, next) {
    if (!req.params.id) {
        return res.status(400).send('Falta ID');
    }
    if (!req.userInfo.estaAutorizado) {    
        return res.status(403).send("No autorizado");
    }
    try {
        const users = await User.find({}).populate("role");
        const filtrados = users.filter(x => 
            x.role.name.toLowerCase() === req.params.id.toLowerCase()
        );
        return res.send(filtrados);
    }
    catch (err) {
        return next(err);
    }
}

async function getAllUsers(req, res, next) {
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {
        const users = await User.find({}).populate('role')
        return res.send(users)
    }    
    catch (err) {
        return next(err)
    }    
}

async function crearUser(req, res, next) {
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {        
        const user = req.body
        const rol = await Role.findById(user.role);                
        if (rol.name === "Administrador" && !req.userInfo.esAdmin) {
            console.warn("Solamente un admin puede crear un admin");
            return res.status(403).send("Solo un administrador puede crear un administrador");
        }
        const pwdHasheada = await bcrypt.hash(user.pwd,10);
        const userN = await User.create({ 
            ...user,
            pwd:pwdHasheada
        });
        const userResp = await User.findById(userN._id).populate("role");
        return res.send(userResp);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send(JSON.stringify(err));
    }
}

async function leerUser(req, res, next) {    
    if (!req.params.id) {
        return res.status(400).send('No hay ID')
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {
        const user = await User.findById(req.params.id).populate('role');        
        if (!user || user.length == 0) {
            res.status(404).send('Usuario no encontrado')
        }
        return res.send(user)
    }
    catch (err) {
        next(err)
    }
}

async function actualizarUser(req, res, next) {    
    if (!req.params.id) {
        res.status(400).send('No hay _id');
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {
        console.log("req.body es")
        console.log(req.body);
        const userA = await User.findById(req.params.id)        
        if (!userA) {
            res.status(404).send('Usuario no encontrado')
        }
        if (req.body.role) {
            const newRole = await Role.findById(req.body.role)
            if (!newRole) {
                return res.status(404).send('ID de rol no encontrado')
            }
            if (newRole.name === "Administrador" && !req.userInfo.esAdmin) {
                return res.status(403).send("Solo un administrador puede crear un administrador");
            }
        }
        else {
            req.body.role = userA.role;
        }         
        if (!req.body.email) {
            req.body.email = userA.email;
        }
        if (!req.body.fullName) {
            req.body.fullName = userA.fullName;
        }        
        if (!req.body.phone) {
            req.body.phone = userA.phone;
        }
        if (!req.body.dni) {
            req.body.dni = userA.dni;
        }
        if (!req.body.bornDate) {
            req.body.bornDate = userA.bornDate;
        }
        if (!req.body.isActive) {
            req.body.isActive = userA.isActive;
        }        
        if (req.body.pwd) {
            const x = await bcrypt.hash(req.body.pwd, 10);
            req.body.pwd = x;
        }
        else {
            req.body.pwd = userA.pwd
        }
        await userA.updateOne(req.body);
        return res.send(userA);
    }
    catch (err) {
        return next(err);
    }
}

async function borrarUser(req, res, next) {
    if (!req.params.id) {
        return res.status(500).send('Falta ID')
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {
        const user = await User.findById(req.params.id).populate("role");
        if (!user) {
            return res.status(404).send('Usuario no encontrado')
        }
        await User.deleteOne({ _id: user._id })        
        return res.send(user)
    }
    catch (err) {
        return next(err)
    }
}

module.exports = router