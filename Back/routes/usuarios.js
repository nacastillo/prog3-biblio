const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../schemas/user')
const Role = require('../schemas/role')

const router = express.Router()
router.get('/', getAllUsers)
router.get("/getByRol/:id", getByRol)
router.post('/', crearUser)
router.get('/:id', leerUser)
router.put('/:id', actualizarUser)
router.delete('/:id', borrarUser)

async function getByRol (req, res, next) {
    if (!req.params.id) {        
        return res.status(500).send('Falta rol');
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

async function getAllUsers(req, res, next) {/*
    console.log('getAllUsers by user ', req.user._id)
    try {
        const users = await User.find({ isActive: true }).populate('role')
        res.send(users)
    } catch (err) {
        next(err)
    }
    */
    try {
        const users = await User.find({}).populate('role')
        return res.send(users)
    }
    catch (err) {
        return next(err)
    }
}

async function crearUser(req, res, next) {
    const user = req.body
    try {
        const pwdHasheada = await bcrypt.hash(user.pwd,10);
        const userN = await User.create({ 
            ...user,
            pwd:pwdHasheada
        });
        const userResp = await User.findById(userN._id).populate("role");
        return res.send(userResp);
    }
    catch (err) {
        return next(err)
    }
}

async function leerUser(req, res, next) {    
    if (!req.params.id) {
        res.status(500).send('No hay dni')
    }
    try {
        const user = await User.findById(req.params.id).populate('role')
        //const user = await User.find({ dni: req.params.id }).populate('role')
        if (!user || user.length == 0) {
            res.status(404).send('Usuario no encontrado')
        }
        res.send(user)
    }
    catch (err) {
        next(err)
    }
}

async function actualizarUser(req, res, next) {    
    if (!req.params.id) {
        res.status(404).send('No hay _id')
    }
    try {
        const userA = await User.findById(req.params.id)        
        if (!userA) {
            res.status(404).send('Usuario no encontrado')
        }
        if (req.body.role) {
            const newRole = await Role.findById(req.body.role)
            if (!newRole) {
                res.status(404).send('ID de rol no encontrado')
            }
        }        
        if (!req.body.email) {
            req.body.email = userA.email
        }        
        if (!req.body.role) {
            req.body.role = userA.role
        }
        if (!req.body.fullName) {
            req.body.fullName = userA.fullName
        }        
        if (!req.body.phone) {
            req.body.phone = userA.phone
        }
        if (!req.body.dni) {
            req.body.dni = userA.dni
        }
        if (!req.body.bornDate) {
            req.body.bornDate = userA.bornDate
        }
        if (!req.body.isActive) {
            req.body.isActive = userA.isActive
        }        
        if (req.body.pwd) {            
            //req.body.pwd = await bcrypt.hash(req.body.pwd, 10);
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