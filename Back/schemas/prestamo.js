const mongoose = require ('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const prestamoSchema = new Schema ({    
    _id: {type: ObjectId, required: true},
    id_libro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Libro',
      required: true
    },
    id_socio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true          
    },
    fecha: {
      type: Date,
      required: true    
    },
});

module.exports = mongoose.model('Prestamo', prestamoSchema);