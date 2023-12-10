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
        res.send(roles)
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
        res.send(rolN)
    }
    catch (err) {
        next(err)
    }
}

async function leerRol(req, res, next) {
    console.log('consultar rol con cod: ', req.params.id)
    if (!req.params.id) {
        res.status(404).send('No hay COD')
    }
    try {
        const rol = await Role.findOne({ cod: req.params.id })
        if (!rol || rol.length == 0) {
            res.status(404).send('Rol no encontrado')
        }
        res.send(rol)
    }
    catch (err) {
        next(err)
    }

}

async function actualizarRol(req, res, next) {
    if (!req.params.id) {
        res.status(404).send('No hay _id')
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
        res.send(rolA)
    }
    catch (err) {
        next(err)
    }
}

async function borrarRol(req, res, next) {    
    if (!req.params.id) {
        return res.status(404).send('No hay id')
    }
    try {
        const rol = await Role.findById(req.params.id)
        if (!rol) {
            return res.status(404).send('Rol no encontrado')
        }
        await Role.deleteOne({ _id: rol._id })
            return res.send(`Rol borrado: ${rol}`)
    }
    catch (err) {
        return next(err)
    }
}

async function getRolById(req, res, next) {
    if (!req.params.id) {
        res.status(500).send('ID param no definido')
    }
    try {
        const rol = await Role.findById(req.params.id);
        if (!rol || rol.length == 0) {
            res.status(404).send('Rol no encontrado')
        }
        res.send(rol)
    } catch (err) {
        next(err)
    }
}

module.exports = router
