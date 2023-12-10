const mongoose = require ('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const prestamoSchema = new Schema ({  
    cod: {
      type: Number,
      required: true,
      unique: true
    },      
    id_libro: {
      type: ObjectId,
      ref: 'Libro',
      required: true
    },
    id_socio: {
      type: ObjectId,
      ref: 'User',
      required: true          
    },
    fechaFin: {
      type: Date,
      required: true    
    },
});

module.exports = mongoose.model('Prestamo', prestamoSchema);