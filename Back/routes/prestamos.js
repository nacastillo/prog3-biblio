const express = require('express')
const Prestamo = require('../schemas/prestamo')
const Libro = require('../schemas/libro')
const User = require('../schemas/user')
const router = express.Router()

router.get('/', getAllPrestamos)
router.get("/misprestamos/:id", misPrestamos);
router.post('/', crearPrestamo)
router.get('/:id', leerPrestamo)
router.put("/finalizar/:id", finalizarPrestamo)
router.put('/:id', actualizarPrestamo)
router.delete('/:id', borrarPrestamo)

function fueraDeTermino (inicio, devuelto) {    
    if (devuelto) {
        return (devuelto.getTime() - inicio.getTime() > 86400000 ? "Sí" : "No");        
    }
    else {
        return "---";
    }    
}

async function misPrestamos (req, res, next) {
    if (!req.params.id) {
        return res.status(500).send("No hay ID de préstamo");
    }
    try {
        const prestamos = await Prestamo.find({id_socio: req.params.id}).populate("id_libro");        
        const prestamos2 = prestamos.map(x => {
            const obj = x.toObject();
            return {...obj, termino: fueraDeTermino(x.fechaInicio, x.fechaDevuelto)}
        })        
        return res.send(prestamos2);        
    }
    catch (err) {
        return next(err);
    }
}

async function finalizarPrestamo (req, res, next) {
    if (!req.params.id) {
        return res.status(500).send("No hay ID de préstamo");
    }
    try {
        const prestamoA = await Prestamo.findById (req.params.id);
        if (!prestamoA) {
            return res.status(404).send('Prestamo no encontrado');
        }
        const libro = await Libro.findById(prestamoA.id_libro);
        if (!libro) {
            return res.status(404).send("Libro no encontrado");
        }        
        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);
        hoy.setUTCHours(hoy.getUTCHours() - 3);
        await prestamoA.updateOne({ fechaDevuelto: hoy });
        const x = {paraPrestamo: libro.paraPrestamo + 1};
        await libro.updateOne(x);        
        const prestamo2 = await Prestamo.findById(req.params.id);
        const test = fueraDeTermino(prestamo2.fechaInicio, prestamo2.fechaDevuelto)        
        if (test === "Sí") {
            const usr = await User.findById(prestamoA.id_socio);
            console.log(usr);
            await usr.updateOne({penalizadoHasta: new Date(prestamo2.fechaDevuelto.getTime() + 15 * 86400000)});
        }
        return res.send(prestamoA);
    }
    catch (err) {
        return next(err);
    }
}

async function getAllPrestamos(req, res, next) {
    try {
        const prestamos = await Prestamo.find({}).populate('id_libro id_socio')
        const prestamos2 = prestamos.map(x => {
            const obj = x.toObject();
            return {...obj, termino: fueraDeTermino(x.fechaInicio, x.fechaDevuelto)}
        })        
        return res.send(prestamos2);
    }
    catch (err) {
        return next(err)
    }
}

async function crearPrestamo(req, res, next) {    
    if (!req.body.id_socio) {
        return res.status(500).send('Falta ID del socio');
    }
    if (!req.body.id_libro) {
        return res.status(500).send('Falta ID del libro');
    }
    try {
        const libro = await Libro.findById(req.body.id_libro);
        if (libro.paraPrestamo <= 0) {
            return res.status(500).send("La cantidad de libros para préstamos es cero o menos");
        }
        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);
        hoy.setUTCHours(hoy.getUTCHours() - 3);
        req.body.fechaInicio = hoy;
        req.body.fechaFin = new Date(hoy.getTime() + 15 * 86400000);        
        const x = {paraPrestamo: libro.paraPrestamo - 1};
        const prestamo = await Prestamo.create({...req.body});
        await libro.updateOne(x);                
        const prestamoN = await Prestamo.findById(prestamo._id).populate("id_libro id_socio");
        return res.send(prestamoN);
    }
    catch (err) {
        return next(err)
    }
}

async function leerPrestamo(req, res, next) {    
    if (!req.params.id) {
        return res.status(500).send('Falta ID del préstamo')
    }
    try {
        const prestamo = await Prestamo.findById(req.params.id).populate('id_libro id_socio')        
        if (!prestamo || prestamo.length == 0) {
            res.status(404).send('Prestamo no encontrado')
        }
        return res.send(prestamo)
    }
    catch (err) {
        return next(err)
    }
}

async function actualizarPrestamo(req, res, next) {    
    if (!req.params.id) {
        return res.status(500).send('No hay _id');
    }
    try {
        const prestamoA = await Prestamo.findById (req.params.id)        
        if (!prestamoA) {
            return res.status(404).send('Prestamo no encontrado');
        }
        if (req.body.fechaInicio == null) {
            req.body.fechaInicio = prestamoA.fechaInicio;
        }        
        if (req.body.fechaFin == null) {
            req.body.fechaFin = prestamoA.fechaFin;
        }
        if (req.body.fechaDevuelto == null) {
            req.body.fechaDevuelto = prestamoA.fechaDevuelto;
        }
        if (req.body.id_socio != null) {
            const newSocio = await User.findById(req.body.id_socio)
            if (!newSocio) {
                return res.status(404).send('ID de socio no encontrado');
            }
        }
        if (req.body.id_libro) {
            const newLibro = await Libro.findById(req.body.id_libro)
            if (!newLibro) {
                return res.status(404).send('ID de libro no encontrado');
            }
            const x = {paraPrestamo: newLibro.paraPrestamo - 1};
            await newLibro.updateOne(x);
            const oldLibro = await Libro.findById(prestamoA.id_libro);
            const y = {paraPrestamo: oldLibro.paraPrestamo + 1};
            await oldLibro.updateOne(y);
        }        
        await prestamoA.updateOne(req.body);
        return res.send(prestamoA);
    }
    catch (err) {
        return next(err);
    }
}

async function borrarPrestamo(req, res, next) {
    if (!req.params.id) {
        return res.status(500).send('No hay _id')
    }
    try {
        const prestamo = await Prestamo.findById(req.params.id).populate("id_libro id_socio");
        if (!prestamo) {
            return res.status(404).send('No se encontro prestamo con ese id')
        }
        await Prestamo.deleteOne({ _id: prestamo._id })
        const libro = await Libro.findById(prestamo.id_libro);
        const x = {paraPrestamo: libro.paraPrestamo + 1}        
        await libro.updateOne(x);
        return res.send(prestamo);
    }
    catch (err) {
        return next(err)
    }
}

module.exports = router