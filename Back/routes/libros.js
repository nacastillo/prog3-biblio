const express = require('express')
const Libro = require('../schemas/libro')
const Genero = require('../schemas/genero')

const router = express.Router()
router.get('/', getAllLibros)
router.get("/getPrestables", getPrestables)
router.post('/', crearLibro)
router.get('/:id', leerLibro)
router.put('/:id', actualizarLibro)
router.delete('/:id', borrarLibro)

async function getPrestables (req, res, next) {
    try {
        const libros = await Libro.find({}).populate("id_genero");
        const prestables = libros.filter(x => x.paraPrestamo > 0);
        return res.send(prestables);
    }   
    catch (err) {
        return next(err);
    }
}

async function getAllLibros(req, res, next) {
    try {        
        const libros = await Libro.find({}).populate('id_genero')        
        return res.send(libros);                
    }
    catch (err) {
        return next(err);        
    }
}

async function crearLibro(req, res, next) { 
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }   
    const libro = req.body
    if (!libro.lecturaLocal) {
        libro.lecturaLocal = 0;
    }
    if (!libro.paraPrestamo) {
        libro.paraPrestamo = 0;
    }
    try {
        const libroN = await Libro.create({ ...libro });
        const libroResp = await Libro.findById(libroN._id).populate("id_genero");
        return res.send(libroResp);
    }
    catch (err) {        
        console.error(err);        
        return res.status(500).send(JSON.stringify(err));
    }
}

async function leerLibro(req, res, next) {    
    if (!req.params.id) {
        res.status(400).send("Falta ID");
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {        
        const libro = await Libro.findById(req.params.id).populate('id_genero');
        if (!libro) {
            res.status(404).send('Libro no encontrado')
        }
        return res.send(libro);        
    }
    catch (err) {
        return next(err)
    }
}

async function actualizarLibro(req, res, next) {    
    if (!req.params.id) {
        res.status(400).send("Falta ID");
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {
        const libroA = await Libro.findById(req.params.id)
        if (!libroA) {
            res.status(404).send('Libro no encontrado');
        }
        if (req.body.id_genero) {
            const newGenero = await Genero.findById(req.body.id_genero)
            if (!newGenero) {
                res.status(404).send('Género no encontrado');
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
        return res.send(libroA);        
    }
    catch (err) {
        return next(err);
    }
}

async function borrarLibro(req, res, next) {
    if (!req.params.id) {
        return res.status(400).send('Falta ID');
    }
    if (!req.userInfo.estaAutorizado) {
        return res.status(403).send("No autorizado");
    }
    try {
        const libro = await Libro.findById(req.params.id).populate("id_genero");
        if (!libro) {
            return res.status(404).send('No se encontro libro con ese ID')
        }
        await Libro.deleteOne({ _id: libro._id })
        return res.send(libro);        
    }
    catch (err) {
        return next(err)
    }
}

module.exports = router