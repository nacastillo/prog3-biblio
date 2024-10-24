const express = require('express')
const bcrypt = require('bcrypt')

const Role = require('../schemas/role')

const router = express.Router()

router.get('/', getAllRoles)

/** Create -> Post, Read -> Get, Update -> Put, Delete -> Delete */

router.post('/', crearRol)
router.get('/:id', leerRol)
router.put('/:id', actualizarRol)
router.delete('/:id', borrarRol)

async function getAllRoles(req, res, next) {
    try {
        const roles = await Role.find({});
        return res.send(roles);        
    }
    catch (err) {
        next(err)
    }
}

async function crearRol(req, res, next) {
    console.log('alta de rol: ', req.body)
    const rol = req.body
    try {
        const rolN = await Role.create({ ...rol })
        return res.send(rolN);
    }
    catch (err) {
        return next(err)
    }
}

async function leerRol(req, res, next) {    
    try {
        const rol = await Role.findOne({ cod: req.params.id })
        if (!rol) {
            return res.status(404).send('Rol no encontrado')
        }
        return res.send(rol)
    }
    catch (err) {
        return next(err)
    }

}

async function actualizarRol(req, res, next) {
    if (!req.params.id) {
        return res.status(500).send('No hay _id')
    }
    try {
        const rolA = await Role.findById(req.params.id)
        if (!rolA) {
            res.status(404).send('Rol no encontrado')
        }
        if (req.body.cod == null) {
            req.body.cod = rolA.cod
        }
        if (req.body.name == null) {
            req.body.name = rolA.name
        }
        await rolA.updateOne(req.body)
        return res.send(rolA)
    }
    catch (err) {
        return next(err)
    }
}

async function borrarRol(req, res, next) {
    try {
        const rol = await Role.findById(req.params.id)
        if (!rol) {
            return res.status(404).send('Rol no encontrado')
        }
        await Role.deleteOne({ _id: rol._id })
        return res.send(rol);
    }
    catch (err) {
        return next(err)
    }
}


module.exports = router
