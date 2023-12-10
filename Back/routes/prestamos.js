const express = require('express')

const Prestamo = require('../schemas/prestamo')
const Libro = require('../schemas/libro')
const User = require('../schemas/user')

const router = express.Router()

router.get('/', getAllPrestamos)

/** Create -> Post, Read -> Get, Update -> Put, Delete -> Delete */

router.post('/', crearPrestamo)
router.get('/:id', leerPrestamo)
router.put('/:id', actualizarPrestamo)
router.delete('/:id', borrarPrestamo)

async function getAllPrestamos(req, res, next) {
    try {
        const prestamos = await Prestamo.find({}).populate('id_libro id_socio')
        res.send(prestamos);
    }
    catch (err) {
        next(err)
    }
}

async function crearPrestamo(req, res, next) {
    const prestamo = req.body
    try {
        const prestamoN = await Prestamo.create({ ...prestamo })
        res.send(prestamoN)
    }
    catch (err) {
        next(err)
    }
}

async function leerPrestamo(req, res, next) {    
    if (!req.params.id) {
        res.status(404).send('No hay ID')
    }
    try {
        const prestamo = await Prestamo.findById(req.params.id).populate('id_libro id_socio')        
        if (!prestamo || prestamo.length == 0) {
            res.status(404).send('Prestamo no encontrado')
        }
        res.send(prestamo)
    }
    catch (err) {
        next(err)
    }
}

async function actualizarPrestamo(req, res, next) {    
    if (!req.params.id) {
        res.status(404).send('No hay _id')
    }
    try {
        const prestamoA = await Prestamo.findById (req.params.id)        
        if (!prestamoA) {
            res.status(404).send('Prestamo no encontrado')
        }
        if (req.body.id_libro != null) {
            const newLibro = await Libro.findById(req.body.id_libro)
            if (!newLibro) {
                res.status(400).send('ID de libro no encontrado')
            }
        }
        if (req.body.id_socio != null) {
            const newSocio = await User.findById(req.body.id_socio)
            if (!newSocio) {
                res.status(400).send('ID de socio no encontrado')
            }
        }
        if (req.body.cod == null) {
            req.body.cod = prestamoA.cod
        }
        if (req.body.fechaFin == null) {
            req.body.fechaFin = prestamoA.fechaFin
        }
        await prestamoA.updateOne(req.body)
        res.send(prestamoA)
    }
    catch (err) {
        next(err)
    }
}

async function borrarPrestamo(req, res, next) {
    if (!req.params.id) {
        return res.status(404).send('No hay _id')
    }
    try {
        const prestamo = await Prestamo.findById(req.params.id)
        if (!prestamo) {
            return res.status(404).send('No se encontro prestamo con ese id')
        }
        await Prestamo.deleteOne({ _id: prestamo._id })
        return res.send(`Prestamo borrado: ${prestamo}`)
    }
    catch (err) {
        return next(err)
    }
}

module.exports = router