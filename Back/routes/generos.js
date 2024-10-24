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
    try {
        //const generoN = await Genero.create({ ...genero })
        const genero = await Genero.create(req.body);
        //res.send(generoN)
        return res.send(genero);
    }
    catch (err) {
        //console.error(err);
        console.log("err.code es:");
        console.log(err.code);
        //next(err)
        if (err.code === 11000) {
            res.message = "hola";
            return res.status(500).send((`Código ya existente (${req.body.cod})`));
        }        
        return next(err);
    }
}

async function leerGenero(req, res, next) {
    //console.log('consultar genero: ', req.params.id)
    if (!req.params.id) {
        res.status(400).send('No hay ID')
    }
    try {
        //const genero = await Genero.find({ cod: req.params.id })
        const genero = await Genero.findById(req.params.id);
        //if (!genero || genero.length == 0) {
        if (!genero) {
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
        res.status(400).send('No hay _id')
    }
    try {
        const genero = await Genero.findById(req.params.id)
        if (!genero) {
            res.status(404).send('Genero no encontrado')
        }
        //if (req.body.cod == null) {
        if (!req.body.cod) {
            req.body.cod = genero.cod
        }
        //if (req.body.desc == null) {
        if (!req.body.desc) {
            req.body.desc = genero.desc
        }
        await genero.updateOne(req.body)
        res.send(genero)
    }
    catch (err) {
        next(err)
    }
}

async function borrarGenero(req, res, next) {    
    if (!req.params.id) {
        //return res.status(400).send('No hay _id')        
        res.status(400).send('No hay _id');
    }
    try {
        const genero = await Genero.findById(req.params.id)
        if (!genero) {
            //return res.status(404).send('No se encontró género con ese _id')
            res.status(404).send("Género no encontrado");
        }
        await Genero.deleteOne({_id: genero._id})
        //return res.send(`Genero borrado: ${genero}`)        
        res.send(genero);
    }
    catch (err) {
        //return next(err)
        next(err)
    }
}

module.exports = router