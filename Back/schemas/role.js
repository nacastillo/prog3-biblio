const mongoose = require('mongoose')

const Schema = mongoose.Schema

const roleSchema = new Schema({  
  cod: {
    type: Number,
    required: true,
    unique: true,
  },
  name: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true, 
    unique: true 
  },
})

module.exports = mongoose.model('Role', roleSchema)