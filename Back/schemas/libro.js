const mongoose = require('mongoose');

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const libroSchema = new Schema({  
  _id: {type: ObjectId, required: true},    
  id: {
    type: Number, 
    required: true
  }, 
  titulo: {
    type: String, 
    required: true
  }, 
  autor: {
    type: String, 
    required: true
  }, 
  cant: {
    type: Number, 
    required: true
  }, 
  prestable: {
    type: Boolean, 
    required: true
  },
  id_genero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genero',
  }   
})

module.exports = mongoose.model('Libro', libroSchema);

/*
const Libro = mongoose.model('Libro', libroSchema);

module.exports = Libro
*/
