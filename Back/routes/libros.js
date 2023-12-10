const express = require('express')
const bcrypt = require('bcrypt')

const Libro = require('../schemas/libro')
const Genero = require('../schemas/genero')

const router = express.Router()

router.get('/', getAllLibros)

/** Create -> Post, Read -> Get, Update -> Put, Delete -> Delete */

router.post('/', crearLibro)
router.get('/:id', leerLibro)
router.put('/:id', actualizarLibro)
router.delete('/:id', borrarLibro)

async function getAllLibros(req, res, next) {
    try {
        const libros = await Libro.find({}).populate('id_genero')
        res.send(libros)
        /*
        if (libros.length == 0) {
          res.send("No hay libros")
        }
        else {      
          res.send(libros);
        }   
        */
    }
    catch (err) {
        next(err);
        /*
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
        */

    }
}

async function crearLibro(req, res, next) {
    console.log('alta de libro: ', req.body)
    const libro = req.body
    try {
        const libroN = await Libro.create({ ...libro })
        res.send(libroN)
    }
    catch (err) {
        next(err)
    }
}

async function leerLibro(req, res, next) {
    console.log('consultar libro con cod: ', req.params.id)
    if (!req.params.id) {
        res.status(404).send('No hay COD')
    }
    try {
        //const libro = await Libro.find({id:req.params.id})
        const libro = await Libro.find({ cod: req.params.id }).populate('id_genero')
        if (!libro || libro.length == 0) {
            res.status(404).send('Libro no encontrado')
        }
        res.send(libro)
    }
    catch (err) {
        next(err)
    }
}

async function actualizarLibro(req, res, next) {
    console.log('actualizar libro con cod: ', req.params.id)
    if (!req.params.id) {
        res.status(404).send('No hay COD')
    }
    try {
        const libroA = await Libro.findById(req.params.id)
        if (!libroA) {
            res.status(404).send('Libro no encontrado')
        }
        if (req.body.id_genero) {
            const newGenero = await Genero.findById(req.body.id_genero)
            if (!newGenero) {
                res.status(400).send('ID de genero no encontrado')
            }
        }
        if (req.body.cod == null) {
            req.body.cod = libroA.cod
        }
        if (!req.body.titulo) {
            req.body.titulo = libroA.titulo
        }
        if (!req.body.autor) {
            req.body.autor = libroA.autor
        }
        if (req.body.lecturaLocal == null) {
            req.body.lecturaLocal = libroA.lecturaLocal
        }
        if (req.body.paraPrestamo == null) {
            req.body.paraPrestamo = libroA.paraPrestamo
        }
        if (req.body.id_genero == null) {
            req.body.id_genero = libroA.id_genero
        }
        await libroA.updateOne(req.body)
        res.send(libroA)
    }
    catch (err) {
        next(err)
    }
}

async function borrarLibro(req, res, next) {
    if (!req.params.id) {
        return res.status(404).send('No hay _id')
    }
    try {
        const libro = await Libro.findById(req.params.id)
        if (!libro) {
            return res.status(404).send('No se encontro libro con ese id')
        }
        await Libro.deleteOne({ _id: libro._id })
        res.send(`Libro borrado: ${libro}`)
    }
    catch (err) {
        return next(err)
    }
}

module.exports = router