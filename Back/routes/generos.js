const express = require('express')
const Genero = require('../schemas/genero')
const router = express.Router()

router.get('/', getAllGeneros)
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
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {        
        const genero = await Genero.create(req.body);        
        return res.send(genero);
    }
    catch (err) {        
        console.error(err); 
        return res.status(500).send(JSON.stringify(err));
    }
}

async function leerGenero(req, res, next) {    
    if (!req.params.id) {
        res.status(400).send('No hay ID')
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {        
        const genero = await Genero.findById(req.params.id);        
        if (!genero) {
            res.status(404).send('Genero no encontrado')
        }
        return res.send(genero)
    }
    catch (err) {
        return next(err)
    }
}

async function actualizarGenero(req, res, next) {    
    if (!req.params.id) {
        res.status(400).send('No hay _id')
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {
        const genero = await Genero.findById(req.params.id)
        if (!genero) {
            res.status(404).send('Genero no encontrado')
        }        
        if (!req.body.cod) {
            req.body.cod = genero.cod
        }        
        if (!req.body.desc) {
            req.body.desc = genero.desc
        }
        await genero.updateOne(req.body)
        return res.send(genero)
    }
    catch (err) {
        return next(err)
    }
}

async function borrarGenero(req, res, next) {    
    if (!req.params.id) {        
        res.status(400).send('No hay _id');
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {
        const genero = await Genero.findById(req.params.id)
        if (!genero) {            
            return res.status(404).send("Género no encontrado");
        }
        await Genero.deleteOne({_id: genero._id})
        return res.send(genero);
    }
    catch (err) {
        return next(err)
    }
}

module.exports = router