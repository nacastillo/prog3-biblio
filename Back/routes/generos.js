const express = require('express')

const Genero = require('../schemas/genero')



const router = express.Router()

router.get('/', getAllGeneros)

/** Create -> Post, Read -> Get, Update -> Put, Delete -> Delete */

router.post('/', crearGenero)
router.get('/:id', leerGenero)
router.put('/:id', actualizarGenero)
router.delete('/:id', borrarGenero)

async function getAllGeneros(req, res, next) {
    try {
        const generos = await Genero.find({})
        res.send(generos)
    }
    catch (err) {
        next(err);
    }
}

async function crearGenero(req, res, next) {
    console.log('alta genero: ', req.body)
    const genero = req.body
    try {
        const generoN = await Genero.create({ ...genero })
        res.send(generoN)
    }
    catch (err) {
        next(err)
    }
}

async function leerGenero(req, res, next) {
    console.log('consultar genero: ', req.params.id)
    if (!req.params.id) {
        res.status(404).send('No hay ID')
    }
    try {
        const genero = await Genero.find({ cod: req.params.id })
        if (!genero || genero.length == 0) {
            res.status(404).send('Genero no encontrado')
        }
        res.send(genero)
    }
    catch (err) {
        next(err)
    }
}

async function actualizarGenero(req, res, next) {    
    if (!req.params.id) {
        res.status(404).send('No hay _id')
    }
    try {
        const generoA = await Genero.findById(req.params.id)
        if (!generoA) {
            res.status(404).send('Genero no encontrado')
        }
        if (req.body.cod == null) {
            req.body.cod = generoA.cod
        }
        if (req.body.desc == null) {
            req.body.desc = generoA.desc
        }
        await generoA.updateOne(req.body)
        res.send(generoA)
    }
    catch (err) {
        next(err)
    }
}

async function borrarGenero(req, res, next) {    
    if (!req.params.id) {
        return res.status(404).send('No hay _id')        
    }
    try {
        const genero = await Genero.findById(req.params.id)
        if (!genero) {
            return res.status(404).send('No se encontró género con ese _id')
        }
        await Genero.deleteOne({_id: genero._id})
        return res.send(`Genero borrado: ${genero}`)        
    }
    catch (err) {
        return next(err)
    }
}

module.exports = router