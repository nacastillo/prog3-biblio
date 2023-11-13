const express = require('express')

const Libro = require('../schemas/libro')

const router = express.Router()

router.get('/', getAllLibros)
router.get('/prestables', getPrestables)
router.get('/noprestables', getNoPrestables)
router.get('/prestables/:id', getPrestablesByQty)

async function getAllLibros (req, res, next) {
  // console.log('prueba de un get all');
  try {
    const libros = await Libro.find({});
    //console.log(libros);
    res.send(libros);
  } 
  catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
    next(error);
  }
}

async function getPrestables (req, res, next) {
  try {
    const libros = await Libro.find({prestable: true});
    res.send(libros);
  }
  catch (error) {
    res.status(500);
    next(error);
  }
}

async function getPrestablesByQty (req, res, next) {
  try {
    // const x = req.params.id;
    const libros = await Libro.find({prestable: true, cant:{$gte: req.params.id}})
    res.send(libros)
  }
  catch (error) {
    res.status(500);
    next(error);
  }
}

async function getNoPrestables (req, res, next) {
  try {
    const libros = await Libro.find({prestable: false});
    res.send(libros)
  }
  catch (error) {
    res.status(500);
    next(error);
  }
}


/*
router.get('/libros', (req, res) => {
  res.send({
    libros
  })
})

*/

/*
const getAllLibros = async (req, res, next) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } 
  catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
    next(error);
  }
}
*/


module.exports = router