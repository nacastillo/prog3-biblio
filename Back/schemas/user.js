const mongoose = require('mongoose')
const validate = require('mongoose-validator')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types
const emailValidator = validate({ validator: 'isEmail' })

const userSchema = new Schema({    
    usr: {type: String, required: true, unique: true, lowercase: true, trim: true },
    pwd: { type: String,   required: true, select: false },    
    email:    { type: String,   required: true, unique: true, lowercase: true, trim: true, validate: emailValidator },
    role:     { type: ObjectId, required: true, ref: 'Role',  },
    fullName: { type: String,   required: true, trim: true },    
    phone:    { type: String,   trim: true },
    dni:      { type: String,   required: true, unique: true },
    bornDate: { type: Date },
    isActive: { type: Boolean, default: true },
    penalizadoHasta: {type: Date}
})

userSchema.method('checkPassword', async function checkPassword(potentialPassword) {
    if (!potentialPassword) {
        return Promise.reject(new Error('Password is required'))
    }
    return await bcrypt.compare(potentialPassword, this.pwd)    
})

const User = mongoose.model('User', userSchema)

module.exports = User