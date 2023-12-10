const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const generoSchema = new Schema ({        
    cod: {
        type: Number, 
        required: true,
        unique: true
    },
    desc: {
        type: String, 
        required: true
    },
}); 

module.exports = mongoose.model('Genero',generoSchema);