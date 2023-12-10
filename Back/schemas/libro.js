const mongoose = require('mongoose');

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const libroSchema = new Schema({      
  cod: {
    type: Number,     
    unique: true
  }, 
  titulo: {
    type: String, 
    required: true
  }, 
  autor: {
    type: String, 
    required: true
  }, 
  lecturaLocal: {
    type: Number, 
    default: 0   
    },
  paraPrestamo:{
    type: Number,   
    default: 0
  },  
  id_genero: {
    type: ObjectId,
    ref: 'Genero',    
  }   
})

module.exports = mongoose.model('Libro', libroSchema);