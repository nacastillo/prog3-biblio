const mongoose = require ('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const generoSchema = new Schema ({    
    _id: {type: ObjectId, required: true},
    cod: {type: Number, required: true},
    desc: {type: String, required: true},
}); 

module.exports = mongoose.model('Genero',generoSchema);

/*
const Genero = mongoose.model('Genero',generoSchema);
module.exports = Genero;
*/

